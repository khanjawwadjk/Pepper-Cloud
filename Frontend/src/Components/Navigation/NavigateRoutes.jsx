import React from 'react';
import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLanding from "../Dashboard/DashboardLanding"
import FormBuilder from '../Forms/FormBuilder';
import FormView from '../Forms/FormView';

export default function NavigateRoutes() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/Dashboard' element={<DashboardLanding />}/>
                <Route path='/Form/Create' element={<FormBuilder />}/>
                <Route path='/Form/:_id' element={<FormView />}/>

                <Route path="/" element={<Navigate to="/Dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}
