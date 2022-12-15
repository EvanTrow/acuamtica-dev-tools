import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';

export type InstanceRow = {
  name: string;
  path: string;
  version: string;
  installPath: string;
  dbName: string;
  dbSize: number;
  dbLogSize: number;
  dbTotalSize: number;
};

type MyState = {
  rows: InstanceRow[];
  test: string;
};

export default function Instances() {
  const [rows, setRows] = React.useState<InstanceRow[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  window.electron.ipcRenderer.on('setInstances', (arg) => {
    setRows(arg as InstanceRow[]);
  });

  const fetchData = () => {
    window.electron.ipcRenderer.sendMessage('getInstances', ['getInstances']);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Install Path</TableCell>
              <TableCell>Database</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} hover>
                <TableCell component="th" scope="row">
                  <a
                    href={'http://' + window.appSettings?.hostname + row.path}
                    target="_blank"
                  >
                    {row.name}
                  </a>
                </TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{row.installPath}</TableCell>
                <TableCell>
                  <Tooltip
                    title={
                      <div>
                        DB: {row.dbSize.toFixed(2)} GB
                        <br />
                        Log: {row.dbLogSize.toFixed(2)} GB
                        <br />
                        Total: {row.dbTotalSize.toFixed(2)} GB
                      </div>
                    }
                    followCursor
                  >
                    <Box>{row.dbName}</Box>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length == 0 ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ) : (
          <></>
        )}
      </TableContainer>
    </>
  );
}
