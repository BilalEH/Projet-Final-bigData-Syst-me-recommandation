import { TextField, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Rechercher un produit...'}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start"><Search size={16} color="#6b7280" /></InputAdornment>,
        },
      }}
      sx={{
        maxWidth: 320,
        width: '100%',
        '& .MuiOutlinedInput-root': {
          background: 'rgba(255, 255, 255, 0.65)', borderRadius: 2.5, fontSize: '0.82rem',
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: 'rgb(36, 48, 74)' },
          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
        },
      }}
    />
  );
}
