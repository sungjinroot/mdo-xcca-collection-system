import Pagination from '@mui/material/Pagination';
import './Footer.css';

function Footer(){


    return (
        <div className="footer"> 
            <Pagination count={20} shape="rounded" sx={{color:'white','& .MuiPaginationItem-root':{color:'white',borderColor:'white'},'& .Mui-selected':{backgroundColor:'white',color:'#000'}}} /> {/* Calculate based on table size soon of artifacts*/}
        </div>
    )
}

export default Footer;