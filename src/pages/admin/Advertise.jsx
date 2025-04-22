import React, { useState } from 'react';
import axios from 'axios';
import {BASE_URL} from '../../API/BaseURL';

const Advertise = () => {
  const [form, setForm] = useState({
    productName: '',
    message: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    bannerImage: null,
  });

  const [ads, setAds] = useState([]);
  const [showAds, setShowAds] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'bannerImage') {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('productName', form.productName);
      formData.append('message', form.message);
      formData.append('discountPercentage', form.discountPercentage);
      formData.append('startDate', form.startDate);
      formData.append('endDate', form.endDate);
      formData.append('bannerImage', form.bannerImage);

      await axios.post(`${BASE_URL}/api/advertise`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Advertisement saved successfully!');
      setForm({
        productName: '',
        message: '',
        discountPercentage: '',
        startDate: '',
        endDate: '',
        bannerImage: null,
      });

      if (showAds) fetchAds(); // Refresh list if already open
    } catch (err) {
      console.error(err);
      alert('Error saving advertisement');
    }
  };

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/advertise`);
      setAds(res.data);
      setShowAds(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await axios.delete(`${BASE_URL}/api/advertise/${id}`);
        fetchAds(); // Refresh after deletion
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '40px',
      flexDirection: 'column',
      marginTop: '-65px'
    }}>
      <div style={{
        alignSelf: 'flex-end',
        marginBottom: '20px'
      }}>
        <button
          onClick={fetchAds}
          style={{
            backgroundColor: '#E16A54',
            color: 'white',
            padding: '10px 20px', // Increased padding for width
            cursor: 'pointer',
            width: '150px',
            marginTop:'20px' // Fixed width
          }}
        >
          Show All Ads
        </button>
      </div>

      <div style={{
        background: '#fff',
        padding: '30px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '500px',
        alignSelf: 'center',
        marginTop: '-16px',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '15px',
          textAlign: 'center',
          marginTop: '2px',
        }}>
          Create Advertisement
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type='text'
            name='productName'
            value={form.productName}
            onChange={handleChange}
            placeholder='Product Name'
            style={{
              padding: '10px',
              border: '1px solid #ddd'
            }}
          />
          <textarea
            name='message'
            value={form.message}
            onChange={handleChange}
            placeholder='Message'
            style={{
              padding: '10px',
              border: '1px solid #ddd'
            }}
            rows={3}
          ></textarea>
          <input
            type='number'
            name='discountPercentage'
            value={form.discountPercentage}
            onChange={handleChange}
            placeholder='Discount Percentage'
            style={{
              padding: '10px',
              border: '1px solid #ddd'
            }}
          />
          <input
            type='date'
            name='startDate'
            value={form.startDate}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ddd'
            }}
          />
          <input
            type='date'
            name='endDate'
            value={form.endDate}
            onChange={handleChange}
            style={{
              padding: '10px',
              border: '1px solid #ddd'
            }}
          />
          <div style={{ marginBottom: '16px' }}>
  <input
    type="file"
    name="bannerImage"
    onChange={handleChange}
    style={{
      padding: '10px',
      border: '1px solid #ddd'
    }}
  />
  <p style={{ fontSize: '15px', color: '#7B3F00', marginTop: '5px' }}>
    For best results, please upload a horizontal image in <strong>16:9</strong> or <strong>2:1</strong> ratio (e.g., <em>1200×600</em> or <em>1920×1080</em>).
  </p>
</div>

          <button
            type='submit'
            style={{
              backgroundColor: '#E16A54',
              color: 'white',
              padding: '10px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </form>
      </div>
      
      {showAds && ads.length > 0 && (
        <div style={{
          marginTop: '40px',
          background: '#fff',
          padding: '20px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          width: '100%',
          overflowX: 'auto'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>All Advertisements</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Message</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Discount</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Start</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>End</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad._id} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ad.productName}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ad.message}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ad.discountPercentage}%</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(ad.startDate).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(ad.endDate).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      style={{
                        backgroundColor: '#E16A54',
                        color: 'white',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Advertise;
