import Pagination from '@mui/material/Pagination';
import './Footer.css';

function Footer({ totalPages, setTotalPages, currentPage, setCurrentPage }) {
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="footer"> 
      <div className="pagination-container">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" sx={{color: 'white','& .MuiPaginationItem-root': { color: 'white', borderColor: 'white' },'& .Mui-selected': { backgroundColor: 'white', color: '#000' }}}/>
      </div>
    </div>
  );
}

export default Footer;