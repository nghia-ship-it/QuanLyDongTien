import React, { useState } from 'react';

export default function Login({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === '123456') {
      onUnlock();
    } else {
      setError('Sai mật khẩu rồi! Nhập lại đi.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full border border-gray-200">
        <div className="text-center mb-6">
          <span className="text-4xl">🔒</span>
          <h2 className="text-xl font-bold text-gray-800 mt-2">Khóa Bảo Mật</h2>
          <p className="text-sm text-gray-500 mt-1">Vui lòng nhập mật khẩu để vào App</p>
        </div>
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="●●●●●●"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full text-center px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            Mở Khóa
          </button>
        </form>
      </div>
    </div>
  );
}