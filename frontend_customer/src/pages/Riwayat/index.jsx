import React from 'react'
import Navbar from '../../components/elements/Navbar';
import Footer from '../../components/elements/Footer';
import Riwayat from '../../components/pages/Riwayat';

const index = () => {
  return (
    <div>
        <Navbar />
        <div className='py-20'>
            <Riwayat/>
        </div>
    </div>
  );
};

export default index;