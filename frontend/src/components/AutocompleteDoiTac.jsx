import React, { useState, useEffect, useRef } from 'react';

export default function AutocompleteDoiTac({ value, onChange, placeholder, loaiDoiTac, token }) {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    // Khi value truyền từ cha bị thay đổi (ví dụ bấm Edit hoặc Reset form)
    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const fetchSuggestions = async (searchTerm) => {
        if (!searchTerm) {
            setSuggestions([]);
            return;
        }
        try {
            const API_URL = `${import.meta.env.VITE_API_URL}/api/doitac/search?query=${encodeURIComponent(searchTerm)}&loai=${loaiDoiTac}`;
            const res = await fetch(API_URL, {
                headers: { 'auth-token': token }
            });
            const data = await res.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Lỗi khi fetch đối tác:', error);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val); // Vẫn truyền tên string về component cha
        if (val.length > 0) {
            setShowDropdown(true);
            fetchSuggestions(val);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelect = (doiTac) => {
        setQuery(doiTac.tenDoiTac);
        onChange(doiTac.tenDoiTac, doiTac.id); // Truyền tên và id về component cha
        setShowDropdown(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                    if (query.length > 0) {
                        setShowDropdown(true);
                        fetchSuggestions(query);
                    }
                }}
                placeholder={placeholder || 'Nhập tên đối tác...'}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                required
            />
            {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((dt) => (
                        <li 
                            key={dt.id}
                            onClick={() => handleSelect(dt)}
                            className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 text-sm"
                        >
                            <div className="font-bold text-gray-800">{dt.tenDoiTac}</div>
                            {dt.soDienThoai && <div className="text-xs text-gray-500">{dt.soDienThoai}</div>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
