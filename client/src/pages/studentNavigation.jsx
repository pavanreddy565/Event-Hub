import React, { Component } from 'react'
import {Routes,Route,Link} from "react-router-dom"

import React from 'react'

function studentNavigation() {
  return (
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Analytics /> } />
            <Route path='/Shipment' element={<Shipment />} />
            <Route path='/Transaction' element={<Transaction />} />
            <Route path='/Wallet' element={<Wallet />} />
    </Routes>
  )
}

export default studentNavigation