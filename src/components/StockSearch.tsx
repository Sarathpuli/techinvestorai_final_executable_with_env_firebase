import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { db, doc, updateDoc, arrayUnion } from "../../firebase";

interface StockSearchProps {
  user: User | null;
}

const StockSearch: React.FC<StockSearchProps> = ({ user }) => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!stockSymbol.trim()) {
      setMessage('Please enter a stock symbol');
      return;
    }
    
    navigate(`/stock/${stockSymbol.toUpperCase().trim()}`);
  };

  const handleAddToPortfolio = async () => {
    if (!user) {
      setMessage('Please login to add stocks to your portfolio');
      return;
    }
    
    if (!user.emailVerified) {
      setMessage('Please verify your email before adding stocks');
      return;
    }
    
    if (!stockSymbol.trim()) {
      setMessage('Please enter a stock symbol');
      return;
    }
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        portfolio: arrayUnion(stockSymbol.toUpperCase().trim())
      });
      
      setMessage(`${stockSymbol.toUpperCase().trim()} added to your portfolio`);
      setStockSymbol('');
    } catch (error) {
      console.error('Error adding stock to portfolio:', error);
      setMessage('Error adding stock to portfolio');
    }
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a stock..."
          value={stockSymbol}
          onChange={(e) => setStockSymbol(e.target.value)}
          className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center space-x-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        
        <button
          onClick={handleAddToPortfolio}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center space-x-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add to Portfolio</span>
        </button>
      </div>
      
      {message && (
        <div className="mt-2 text-sm text-yellow-300 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
};

export default StockSearch;