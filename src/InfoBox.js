import React from 'react'
import { CardContent, Card, Typography } from '@material-ui/core';
import "./InfoBox.css";

function InfoBox({title,cases,active,total,...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'info__selected'}` }>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                <h2 className="infoBox__cases">{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
