import React, { useState ,useEffect} from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import io from "socket.io-client";


const Delta = () => {
  const [product, setProduct] = useState([]);
  const [response, setResponse] = useState("");
  const ENDPOINT = "wss://production-esocket.delta.exchange";
  const [bids, setBids] = useState([0]);
  useEffect(() => {
    var socket = new WebSocket(ENDPOINT);
    socket.onopen = function(event) {
        console.log('Connection established');
    }

    const apiCall = {
        "type": "subscribe",
        "payload": {
            "channels": [
                {
                    "name": "v2/ticker",
                    "symbols": [
                        "BTCUSD",
                        "BTCUSDT"
                    ]
                }
            ]
        }
    }

    socket.onopen = (event) => {
        socket.send(JSON.stringify(apiCall));
      };

      socket.onmessage = function (event) {
      
        const json = JSON.parse(event.data);
       
       setBids(json.mark_price)
      };

     
  
  }, []);
  useEffect(() => {
    setTimeout(() => {
        axios
        .get("https://api.delta.exchange/v2/products?page_size=30")
        .then((res) => {
          setProduct(res.data.result);
        });
    },5000)
   
  }, []);
  return (
 
    <Paper sx={{ width: '90%', overflow: 'hidden', marginTop:'100px', marginLeft:'100px' }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow style={{color:"white"}}>
          <TableCell>Symbol</TableCell>
             <TableCell align="center">Description</TableCell>
             <TableCell align="center">Underlying Asset</TableCell>
            <TableCell align="center">Mark Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {/* {console.log(bids)} */}
          {product?.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell component="th" scope="row">
               {row.symbol}
             </TableCell>
             <TableCell align="center">{row.description}</TableCell>
             <TableCell align="center">{row.underlying_asset.symbol}</TableCell>
             <TableCell align="center">{bids}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
   
  </Paper>
  );
};

export default Delta;
