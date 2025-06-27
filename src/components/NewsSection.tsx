import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, TrendingUp, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category?: string;
  imageUrl?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface NewsSectionProps {
  className?: string;
}

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || '';
const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';

const NewsSection: React.FC<NewsSectionProps> = ({ className = '' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const categories = [
    { id: 'general', label: 'Market News', icon: TrendingUp },
    { id: 'technology', label: 'Tech Stocks', icon: Newspaper },
    { id: 'earnings', label: 'Earnings', icon: Calendar }
  ];

  // Fetch news from Alpha Vantage News API
  const fetchAlphaVantageNews = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets,earnings,technology&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error('Failed to fetch news data');
      }
      
      if (data.feed && Array.isArray(data.feed)) {
        return data.feed.slice(0, 10).map((item: any, index: number) => ({
          id: index.toString(),
          title: item.title,
          description: item.summary,
          url: item.url,
          publishedAt: item.time_published,
          source: item.source,
          imageUrl: item.banner_image,
          sentiment: item.overall_sentiment_label?.toLowerCase() || 'neutral'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching Alpha Vantage news:', error);
      throw error;
    }
  };

  // Fetch news from NewsAPI (alternative)
  const fetchNewsAPI = async (category: string) => {
    try {
      let query = '';
      switch (category) {
        case 'technology':
          query = 'technology stocks OR tech earnings OR semiconductor';
          break;
        case 'earnings':
          query = 'earnings report OR quarterly results OR financial results';
          break;
        default:
          query = 'stock market OR investing OR financial markets';
      }

      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }
      
      return data.articles.map((article: any, index: number) => ({
        id: index.toString(),
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        imageUrl: article.urlToImage,
        category: category
      }));
    } catch (error) {
      console.error('Error fetching NewsAPI:', error);
      throw error;
    }
  };

  // Mock news data fallback
  const getMockNews = (): NewsItem[] => {
    const mockNews = [
      {
        id: '1',
        title: 'Major Tech Stocks Rally as AI Sector Shows Strong Growth',
        description: 'Technology stocks surged today as artificial intelligence companies reported better-than-expected quarterly results.',
        url: '#',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Financial Times',
        sentiment: 'positive' as const
      },
      {
        id: '2',
        title: 'Federal Reserve Holds Interest Rates Steady',
        description: 'The Federal Reserve maintained current interest rates, citing stable inflation and employment data.',
        url: '#',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'Reuters',
        sentiment: 'neutral' as const
      },
      {
        id: '3',
        title: 'Renewable Energy Stocks Gain Momentum',
        description: 'Clean energy companies see increased investor interest following new government incentives.',
        url: '#',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: 'Bloomberg',
        sentiment: 'positive' as const
      },
      {
        id: '4',
        title: 'Quarterly Earnings Season Begins with Mixed Results',
        description: 'Early earnings reports show varied performance across different sectors of the market.',
        url: '#',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: 'CNBC',
        sentiment: 'neutral' as const
      },
      {
        id: '5',
        title: 'Cryptocurrency Market Shows Signs of Recovery',
        description: 'Digital assets rebound after recent volatility, with Bitcoin and Ethereum leading gains.',
        url: '#',
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        source: 'CoinDesk',
        sentiment: 'positive' as const
      }
    ];

    // Filter based on selected category
    if (selectedCategory === 'technology') {
      return mockNews.filter(item => 
        item.title.toLowerCase().includes('tech') || 
        item.title.toLowerCase().includes('ai') ||
        item.title.toLowerCase().includes('crypto')
      );
    } else if (selectedCategory === 'earnings') {
      return mockNews.filter(item => 
        item.title.toLowerCase().includes('earnings') || 
        item.title.toLowerCase().includes('quarterly')
      );
    }
    
    return mockNews;
  };

  const fetchNews = async (category: string = 'general') => {
    setLoading(true);
    setError(null);
    
    try {
      let newsData: NewsItem[] = [];
      
      // Try Alpha Vantage first
      if (ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== 'demo') {
        try {
          newsData = await fetchAlphaVantageNews();
        } catch (error) {
          console.warn('Alpha Vantage news failed, trying NewsAPI...');
          
          // Fallback to NewsAPI
          if (NEWS_API_KEY) {
            newsData = await fetchNewsAPI(category);
          }
        }
      } else if (NEWS_API_KEY) {
        newsData = await fetchNewsAPI(category);
      }
      
      // If no API keys or all APIs failed, use mock data
      if (newsData.length === 0) {
        console.warn('Using mock news data - configure API keys for real data');
        newsData = getMockNews();
      }
      
      setNews(newsData);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Using sample data.');
      setNews(getMockNews());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div className={`bg-gray-800 p-6 rounded shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Newspaper className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Market News</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">
            Updated {formatDate(lastUpdated.toISOString())}
          </span>
          <button
            onClick={() => fetchNews(selectedCategory)}
            disabled={loading}
            className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            title="Refresh news"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-1 mb-4 bg-gray-700 rounded p-1">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded">
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-16 h-16 bg-gray-700 rounded flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {news.map((item) => (
            <article key={item.id} className="group cursor-pointer">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-gray-700 p-3 rounded transition-colors"
              >
                <div className="flex space-x-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-blue-400 group-hover:text-blue-300 font-medium text-sm leading-tight mb-1 pr-2">
                        {item.title}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-300 text-xs leading-relaxed mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{item.source}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">{formatDate(item.publishedAt)}</span>
                      </div>
                      
                      {item.sentiment && (
                        <div className={`flex items-center space-x-1 ${getSentimentColor(item.sentiment)}`}>
                          <span>{getSentimentIcon(item.sentiment)}</span>
                          <span className="capitalize">{item.sentiment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </article>
          ))}
          
          {news.length === 0 && !loading && (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No news available for this category</p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          News data provided by Alpha Vantage and NewsAPI
        </p>
      </div>
    </div>
  );
};

export default NewsSection;