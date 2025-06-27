import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowLeft, ExternalLink, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Tweet } from 'react-tweet';

interface StockDetails {
  price: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  marketCap?: number;
  peRatio?: number;
  exchange?: string;
  name?: string;
  bookValue?: number;
  dividend?: number;
  roe?: number;
  otherIncome?: number;
  debtorDays?: { current: number; previous: number };
}

interface NewsItem {
  id: string;
  headline: string;
  url: string;
  datetime: number;
}

interface Analysis {
  point: string;
  type: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

const StockPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stockDetails, setStockDetails] = useState<StockDetails | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tweets, setTweets] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<Analysis[]>([]);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call with mock data for demo
        setTimeout(() => {
          // Mock stock details with additional metrics
          const mockDetails: StockDetails = {
            price: parseFloat((Math.random() * 500 + 50).toFixed(2)),
            high: parseFloat((Math.random() * 500 + 60).toFixed(2)),
            low: parseFloat((Math.random() * 500 + 40).toFixed(2)),
            open: parseFloat((Math.random() * 500 + 45).toFixed(2)),
            prevClose: parseFloat((Math.random() * 500 + 48).toFixed(2)),
            marketCap: parseFloat((Math.random() * 100 + 5).toFixed(1)),
            peRatio: parseFloat((Math.random() * 40 + 10).toFixed(1)),
            exchange: "NASDAQ",
            name: `${symbol} Technologies Inc.`,
            bookValue: 7.58,
            dividend: 0,
            roe: -0.49,
            otherIncome: 1077,
            debtorDays: { current: 35.1, previous: 27.5 }
          };
          
          // Mock news
          const mockNews: NewsItem[] = [
            {
              id: '1',
              headline: `${symbol} Reports Strong Q2 Earnings, Beats Expectations`,
              url: '#',
              datetime: Date.now() - 86400000
            },
            {
              id: '2',
              headline: `Analysts Set $${(mockDetails.price * 1.2).toFixed(2)} Price Target for ${symbol}`,
              url: '#',
              datetime: Date.now() - 172800000
            },
            {
              id: '3',
              headline: `${symbol} Announces New Product Line, Shares Jump 5%`,
              url: '#',
              datetime: Date.now() - 259200000
            },
            {
              id: '4',
              headline: `Institutional Investors Increase Positions in ${symbol}`,
              url: '#',
              datetime: Date.now() - 345600000
            }
          ];

          // Mock tweets
          const mockTweets = [
            '1767742391092162561',
            '1767741891092162561',
            '1767741791092162561'
          ];

          // Generate analysis based on mock data
          const mockAnalysis: Analysis[] = [
            {
              point: `Stock is trading at ${mockDetails.bookValue} times its book value`,
              type: mockDetails.bookValue > 5 ? 'negative' : 'positive',
              explanation: 'A high price-to-book ratio might indicate overvaluation'
            },
            {
              point: 'Company is not paying dividends despite profitability',
              type: 'neutral',
              explanation: 'This could indicate the company is reinvesting in growth'
            },
            {
              point: `Return on Equity (ROE) of ${mockDetails.roe}% over last 3 years`,
              type: 'negative',
              explanation: 'Negative ROE indicates poor profitability'
            },
            {
              point: `Other income of ₹${mockDetails.otherIncome} Cr in earnings`,
              type: 'neutral',
              explanation: 'High other income might not represent core business strength'
            },
            {
              point: `Debtor days increased from ${mockDetails.debtorDays.previous} to ${mockDetails.debtorDays.current}`,
              type: 'negative',
              explanation: 'Increasing debtor days might indicate collection issues'
            }
          ];
          
          setStockDetails(mockDetails);
          setNews(mockNews);
          setTweets(mockTweets);
          setAnalysis(mockAnalysis);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load stock data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getAnalysisIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'negative':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'neutral':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{symbol}</h1>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="bg-red-900 bg-opacity-20 border border-red-800 p-6 rounded">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {loading ? 'Loading...' : `${symbol} - ${stockDetails?.name}`}
        </h1>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-6 bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold">${stockDetails?.price.toFixed(2)}</span>
                <span className={`ml-3 flex items-center ${stockDetails?.price > stockDetails?.prevClose ? 'text-green-500' : 'text-red-500'}`}>
                  {stockDetails?.price > stockDetails?.prevClose ? (
                    <TrendingUp className="w-5 h-5 mr-1" />
                  ) : (
                    <TrendingDown className="w-5 h-5 mr-1" />
                  )}
                  {((Math.abs(stockDetails?.price - stockDetails?.prevClose) / stockDetails?.prevClose) * 100).toFixed(2)}%
                </span>
              </div>
              
              <ul className="space-y-2 text-gray-300">
                <li className="flex justify-between">
                  <span className="text-gray-400">High:</span>
                  <span>${stockDetails?.high.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Low:</span>
                  <span>${stockDetails?.low.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Open:</span>
                  <span>${stockDetails?.open.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Previous Close:</span>
                  <span>${stockDetails?.prevClose.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Market Cap:</span>
                  <span>${stockDetails?.marketCap}B</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">P/E Ratio:</span>
                  <span>{stockDetails?.peRatio}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Exchange:</span>
                  <span>{stockDetails?.exchange}</span>
                </li>
              </ul>
            </>
          )}
        </div>
        
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Latest News</h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {news.map((item) => (
                <li key={item.id} className="border-b border-gray-700 pb-3 last:border-0">
                  <a href={item.url} className="flex group items-start" target="_blank" rel="noopener noreferrer">
                    <div className="flex-grow">
                      <h3 className="text-blue-400 group-hover:text-blue-300 transition-colors">{item.headline}</h3>
                      <p className="text-gray-400 text-sm">{formatDate(item.datetime)}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 mt-1 transition-colors flex-shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stock Analysis</h2>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analysis.map((item, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded">
                  <div className="flex items-start space-x-3">
                    {getAnalysisIcon(item.type)}
                    <div>
                      <p className="font-medium">{item.point}</p>
                      <p className="text-sm text-gray-400 mt-1">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Social Media Updates</h2>
            <button 
              onClick={() => setLoading(true)}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {tweets.map((tweetId) => (
                <div key={tweetId} className="bg-gray-900 rounded overflow-hidden">
                  <Tweet id={tweetId} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Stock Chart</h2>
        
        {loading ? (
          <div className="animate-pulse h-80 bg-gray-700 rounded"></div>
        ) : (
          <div className="h-80 bg-gray-900 rounded flex items-center justify-center border border-gray-700">
            <p className="text-gray-400">Interactive chart would appear here in a real application</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;