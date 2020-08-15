import React from 'react'
import { 
    Card, Form,
    Row, Col
 } from "react-bootstrap";

export default function FilterBar({ filterSex }) {
    function updateSexFilter(e){
        filterSex(e.target.value)
    }

    return (
        <div className="filterBar_wrapper mb-4">
            <Card body>
                <Row>
                    <Col md={6}>
                        <label htmlFor="sex_select" style={{marginRight: '10px'}}>Sex</label>
                        <select name="sex_select" id="sex_select" onChange={updateSexFilter}>
                            <option value={'all'}>All</option>
                            <option value={'female'}>Female</option>
                            <option value={'male'}>Male</option>
                        </select>
                    </Col>
                </Row>

            </Card>
        </div>
    )
}
