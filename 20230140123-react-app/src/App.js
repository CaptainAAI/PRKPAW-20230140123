import React, { useEffect, useState } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editId, setEditId] = useState(null);

  // Ambil data dari backend saat pertama kali render
  useEffect(() => {
    fetch('http://localhost:3001/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Gagal ambil data:', err));
  }, []);

  // Tambah / Update buku
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBook = { title, author };

    if (editId) {
      // Update
      const res = await fetch(`http://localhost:3001/api/books/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });

      if (res.ok) {
        const updated = await res.json();
        setBooks(prev => prev.map(b => (b.id === editId ? updated : b)));
        setEditId(null);
        setTitle('');
        setAuthor('');
      } else {
        alert('Gagal mengupdate buku!');
      }
    } else {
      // Create
      const res = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });

      if (res.ok) {
        const added = await res.json();
        setBooks(prev => [...prev, added]);
        setTitle('');
        setAuthor('');
      } else {
        alert('Gagal menambahkan buku!');
      }
    }
  };

  // Hapus buku
  const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:3001/api/books/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setBooks(prev => prev.filter(b => b.id !== id));
    } else {
      alert('Gagal menghapus buku!');
    }
  };

  // Edit buku (isi form dengan data lama)
  const handleEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📚 Manajemen Buku</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Judul Buku"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Penulis"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {editId ? 'Simpan Perubahan' : 'Tambah Buku'}
          </button>
          {editId && (
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => {
                setEditId(null);
                setTitle('');
                setAuthor('');
              }}
            >
              Batal
            </button>
          )}
        </form>

        <ul style={styles.list}>
          {books.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Belum ada buku</p>
          ) : (
            books.map(book => (
              <li key={book.id} style={styles.listItem}>
                <div>
                  <p style={styles.bookTitle}>{book.title}</p>
                  <p style={styles.bookAuthor}>{book.author}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(book)}
                    style={styles.editBtn}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;

// --- Gaya CSS (inline style) ---
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2563eb'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelButton: {
    padding: '10px',
    backgroundColor: '#9ca3af',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #e5e7eb'
  },
  bookTitle: {
    fontWeight: 'bold',
    margin: 0,
    color: '#111827'
  },
  bookAuthor: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280'
  },
  editBtn: {
    marginRight: '8px',
    padding: '6px 10px',
    backgroundColor: '#facc15',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '6px 10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};
