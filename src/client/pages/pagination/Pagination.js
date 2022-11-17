import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from "antd";
const Paginator = ({ postsPerPage, totalPosts, paginate, currentPage}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <Link  onClick={ () =>{ paginate(number)}} to= {`/products/${number}`} className='page-link'>{number}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
export default Paginator;
