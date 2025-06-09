import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import Button from '@mui/material/Button';
import { TextField, FormControl, InputLabel, MenuItem, Box, CircularProgress,Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'; 
import './AdminSettings.css'; 
import Select, { SelectChangeEvent } from '@mui/material/Select';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface User {
  _id: string;
  email: string;
  name: string;
  role?: string;
}

const AdminSettings: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/user/all`, {
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Delete user
  const handleDelete = async (email: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/user/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter((user) => user.email !== email));
    } catch (err) {
      alert('Error deleting user');
      console.error(err);
    }
  };

const [newUser, setNewUser] = useState({
  email: '',
  password: '',
  name: '',
  role: 'Normal',
});
const [adding, setAdding] = useState(false);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setNewUser({ ...newUser, [e.target.name]: e.target.value });
};

const handleSelectChange = (e: SelectChangeEvent<string>) => {
  const name = e.target.name as string;
  setNewUser({ ...newUser, [name]: e.target.value });
};

const handleAddUser = async (e: React.FormEvent) => {
  e.preventDefault();
  setAdding(true);
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });
    if (!res.ok) throw new Error('Failed to add user');
    const createdUser = await res.json();
    setUsers([...users, createdUser]);
    setNewUser({ email: '', password: '', name: '', role: 'Normal' });
  } catch (err) {
    alert('Error adding user');
    console.error(err);
  } finally {
    setAdding(false);
  }
};


        interface Item {
          _id?: string;
          name: string;
          category: string;
          price: number | string;
        }

        const [items, setItems] = useState<Item[]>([]);
        const [_, setLoadingItems] = useState(true);
        const [newItem, setNewItem] = useState<Item>({ name: '', category: '', price: '' });
        const [addingItem, setAddingItem] = useState(false);

        const handleItemInputChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          setNewItem({ ...newItem, [e.target.name]: e.target.value });
        };

        const handleDeleteItem = async (name: string) => {
          if (!window.confirm('Are you sure you want to delete this item?')) return;
          try {
            const res = await fetch(`${API_BASE_URL}/items/delete-by-name`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error('Failed to delete item');
            setItems(items.filter((item) => item.name !== name));
          } catch (err) {
            alert('Error deleting item');
            console.error(err);
          }
        };

        useEffect(() => {
          const fetchItems = async () => {
            setLoadingItems(true);
            try {
              const res = await fetch(`${API_BASE_URL}/items`);
              if (!res.ok) throw new Error('Failed to fetch items');
              const data = await res.json();
              setItems(data);
            } catch (err) {
              console.error(err);
            } finally {
              setLoadingItems(false);
            }
          };
          fetchItems();
        }, []);

  const [tableCount, setTableCount] = useState<number | null>(null);
  const [newCount, setNewCount] = useState('');
  const [loadingTableCount, setLoadingTableCount] = useState(false);
  const [updatingTableCount, setUpdatingTableCount] = useState(false);

  useEffect(() => {
    setLoadingTableCount(true);
    fetch(`${API_BASE_URL}/settings/table-count`)
      .then(res => res.json())
      .then(data => {
        setTableCount(data);
        setNewCount(data.toString());
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingTableCount(false));
  }, []);

  const handleUpdateTableCount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setUpdatingTableCount(true);
    try {
      const res = await fetch(`${API_BASE_URL}/settings/table-count`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tableCount: Number(newCount) }),
      });
      if (!res.ok) throw new Error('Failed to update table count');
      const data = await res.json();
      setTableCount(data.tableCount);
      setNewCount(data.tableCount.toString());
    } catch (err) {
      alert('Error updating table count');
      console.error(err);
    } finally {
      setUpdatingTableCount(false);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (

  <div className="centered-container">
    
      <div>
        <Typography variant="h3"   sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 , mt: 5 }}>
          Admin Settings
        </Typography>
      </div>
      
      <hr style={{ margin: '1px 0', border: 0, borderTop: '1px solid #ccc', width: '100%' }} />

        <div>
        {/* Table Count Display and Update */}
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, mb: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight:"bold"}}>
            Change the number of Tables
          </Typography>

          <Box component="form" onSubmit={handleUpdateTableCount} sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
            <TextField
              label="Update Table Count"
              type="number"
              value={newCount}
              onChange={e => setNewCount(e.target.value)}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ width: 160 }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={updatingTableCount || loadingTableCount}>
              {updatingTableCount ? <CircularProgress size={20} /> : 'Update'}
            </Button>
          </Box>

                    {loadingTableCount ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Current Table count is {tableCount !== null ? tableCount : 'N/A'}
            </Typography>
          )}
        </Box>
  </div>

          <hr style={{ margin: '48px 0', border: 0, borderTop: '1px solid #ccc', width: '100%' }} />

      {/* Centered content */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '64px',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            flexWrap: 'wrap',
          }}
        >
          {/* Add User Form */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              minWidth: 340,
              maxWidth: 380,
              flex: '1 1 340px',  
              mb: { xs: 3, md: 0 },

            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb:2 }}>
              Add New User
            </Typography>
            <Box
              component="form"
              onSubmit={handleAddUser}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: 2,
              }}
            >
              <TextField
                label="Email"
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Display Name"
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={newUser.role}
                  label="Role"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  {/* <MenuItem value="Admin">Admin</MenuItem> */}
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={adding}
                sx={{ mt: 1 }}
              >
                {adding ? <CircularProgress size={24} /> : 'Add User'}
              </Button>
            </Box>
          </Paper>

          {/* Users List */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minWidth: 340,
              maxWidth: 640,
              flex: '1 1 340px',
              minHeight: 400,
              maxHeight: 800,
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
              Current Users
            </Typography>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell><b>Role</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role || '-'}</TableCell>
                      <TableCell>
                        {user.role !== "Admin" ? (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(user.email)}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            disabled
                            sx={{ opacity: 0.5, cursor: 'not-allowed' }}
                          >
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        
        <hr style={{ margin: '48px 0', border: 0, borderTop: '1px solid #ccc', width: '100%' }} />

        {/* Add Item and List Items */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '64px',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            flexWrap: 'wrap',
          }}
        >
          {/* Add Item Form */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              minWidth: 340,
              maxWidth: 380,
              flex: '1 1 340px',
              mb: { xs: 3, md: 0 },
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
              Add New Item
            </Typography>
            <Box
              component="form"
              onSubmit={async (e) => {
                e.preventDefault();
                setAddingItem(true);
                try {
                  const res = await fetch(`${API_BASE_URL}/items`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newItem),
                  });
                  if (!res.ok) throw new Error('Failed to add item');
                  const createdItem = await res.json();
                  setItems([...items, createdItem]);
                  setNewItem({ name: '', category: '', price: '' });
                } catch (err) {
                  alert('Error adding item');
                  console.error(err);
                } finally {
                  setAddingItem(false);
                }
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                marginTop: 2,
              }}
            >
              <TextField
                label="Name"
                name="name"
                value={newItem.name}
                onChange={handleItemInputChange}
                required
                fullWidth
              />
              <TextField
                label="Category"
                name="category"
                value={newItem.category}
                onChange={handleItemInputChange}
                required
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={newItem.price}
                onChange={handleItemInputChange}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addingItem}
                sx={{ mt: 1 }}
              >
                {addingItem ? <CircularProgress size={24} /> : 'Add Item'}
              </Button>
            </Box>
          </Paper>

          {/* Items List */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minWidth: 340,
              maxWidth: 640,
              flex: '1 1 340px',
              minHeight: 400,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 2 }}>
              Current Items
            </Typography>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Category</b></TableCell>
                    <TableCell><b>Price</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item._id || item.name}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteItem(item.name)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>

        
        <hr style={{ margin: '48px 0', border: 0, borderTop: '1px solid #ccc', width: '100%' }} />

  </div>

  );
};

export default AdminSettings;