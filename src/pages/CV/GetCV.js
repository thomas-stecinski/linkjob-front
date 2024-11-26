import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ShowCV from '../../components/ShowCV';
import { useAuth } from '../../context/AuthContext';



export default function GetCV() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ShowCV />
    </div>
  );
}
