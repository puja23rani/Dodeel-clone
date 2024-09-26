import React, { useEffect, useState } from 'react'
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';

const MonthAndYear = ({ onMonthYearChange }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }); // Get current month in full name

    const [state, setState] = useState({
        month: currentMonth,
        year: currentYear,
    });

    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]);

    useEffect(() => {
        const generateYears = () => {
            const yearsArray = [];
            for (let i = 0; i < 10; i++) {
                yearsArray.push(currentYear - i);
            }
            setYears(yearsArray);
        };

        generateYears();
    }, [currentYear]);

    useEffect(() => {
        // Whenever month or year changes, call the parent handler
        onMonthYearChange(state.month, state.year);
    }, [state, onMonthYearChange]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: "1rem", width: "36rem", marginRight: "1rem" }}>
            <Grid style={{ width: '100%', marginTop: '-8px' }}>
                <FormControl fullWidth variant="standard">
                    <InputLabel>Month</InputLabel>
                    <Select
                        value={state.month}
                        label="Month"
                        style={{ width: '100%', height: "2.8rem" }}
                        onChange={(e) => setState({ ...state, month: e.target.value })}
                    >
                        {months.map((month, index) => (
                            <MenuItem key={index} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid style={{ width: '100%', marginTop: '-8px' }}>
                <FormControl fullWidth variant="standard">
                    <InputLabel>Year</InputLabel>
                    <Select
                        value={state.year}
                        style={{ width: '100%', height: "2.8rem" }}
                        onChange={(e) => setState({ ...state, year: e.target.value })}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </div>
    )
}

export default MonthAndYear