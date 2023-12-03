import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";

const ContactListApp = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '' });
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    // Fetch users from the API
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setContacts(response.data))
      .catch(error => console.error('Error fetching contacts:', error));
  }, []);

  // Add the details of new contact
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prevContact => ({ ...prevContact, [name]: value }));
  };

  const addContact = () => {
    // Make a POST call to add a new contact
    axios.post('https://jsonplaceholder.typicode.com/users', newContact)
      .then(response => setContacts([...contacts, response.data]))
      .catch(error => console.error('Error adding contact:', error));

    // Clear the input fields
    setNewContact({ name: '', email: '', phone: '' });
  };

  const updateContact = () => {
    // Make a PUT call to update the selected contact
    axios.put(`https://jsonplaceholder.typicode.com/users/${editingContact.id}`, editingContact)
      .then(response => {
        setContacts(contacts.map(contact => (contact.id === editingContact.id ? response.data : contact)));
        setEditingContact(null);
      })
      .catch(error => console.error('Error updating contact:', error));
  };

  const deleteContact = (id) => {
    // Make a DELETE call to remove the selected contact
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => setContacts(contacts.filter(contact => contact.id !== id)))
      .catch(error => console.error('Error deleting contact:', error));
  };

  const startEditing = (contact) => {
    setEditingContact(contact);
  };

  const cancelEditing = () => {
    setEditingContact(null);
  };

  return (
    <div className='container'>
      <h1>Contact List</h1>

      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            {/* Check the condition to edit a contact */}
            {editingContact === contact ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                />
                <input
                  type="text"
                  name="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                />
                <input
                  type="text"
                  name="phone"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                />
                <button onClick={updateContact}>Update</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div className='contacts'>
                <div>
                <b>Name:</b>{contact.name} <br/>
                <b>Email:</b>{contact.email}<br/>
                <b>Phone:</b>{contact.phone}
                </div>
                <div>
                <button onClick={() => startEditing(contact)}>Edit</button>
                <button onClick={() => deleteContact(contact.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2>Add New Contact</h2>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newContact.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={newContact.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newContact.phone}
          onChange={handleInputChange}
        />
        <button onClick={addContact}>Add Contact</button>
      </div>
    </div>
  );
};

export default ContactListApp;