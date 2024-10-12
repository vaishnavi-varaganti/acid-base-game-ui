import React, { useState, useEffect, useCallback  } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './Reports.css';

const Reports = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api-generator.retool.com/R5pZpT/gamedetails?_page=${page}&_limit=10`
      );
      const totalCount = response.headers['x-total-count'];
      setTotalPages(Math.ceil(totalCount / 10));
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const downloadReport = () => {
    const formattedData = data.map(item => [
      item.SID,
      item.Firstname,
      item.Lastname,
      item.Level_1_Score,
      item.Level_2_Score,
      item.Level_3_Score,
      item.Level_4_Score,
      parseInt(item.Level_1_Score) + parseInt(item.Level_2_Score) + parseInt(item.Level_3_Score) + parseInt(item.Level_4_Score)
    ]);
    const headers = ['SID', 'First Name', 'Last Name', 'Level 1 Score', 'Level 2 Score', 'Level 3 Score', 'Level 4 Score', 'Total'];
    formattedData.unshift(headers);
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'GameReport.xlsx');
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Reports</h2>
        <div className="search-download">
          <input
            type="text"
            placeholder="Search by SID or Name"
            value={search}
            onChange={handleSearchChange}
          />
          <button onClick={downloadReport}>Download Report</button>
        </div>
      </div>

      <table className="reports-table">
        <thead>
          <tr>
            <th>SID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Level 1 Score</th>
            <th>Level 2 Score</th>
            <th>Level 3 Score</th>
            <th>Level 4 Score</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter(
              item =>
                item.SID.toLowerCase().includes(search.toLowerCase()) ||
                item.Firstname.toLowerCase().includes(search.toLowerCase()) ||
                item.Lastname.toLowerCase().includes(search.toLowerCase())
            )
            .map((item, index) => (
              <tr key={index}>
                <td>{item.SID}</td>
                <td>{item.Firstname}</td>
                <td>{item.Lastname}</td>
                <td>{item.Level_1_Score}</td>
                <td>{item.Level_2_Score}</td>
                <td>{item.Level_3_Score}</td>
                <td>{item.Level_4_Score}</td>
                <td>
                  {parseInt(item.Level_1_Score) +
                    parseInt(item.Level_2_Score) +
                    parseInt(item.Level_3_Score) +
                    parseInt(item.Level_4_Score)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Reports;