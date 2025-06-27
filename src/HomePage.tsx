import React from 'react';
import { User } from 'firebase/auth';
import StockSearch from '../components/StockSearch';
import AskAI from '../components/AskAI';
import StockPortfolio from '../components/StockPortfolio';
import NewsSection from '../components/NewsSection';
import StockQuiz from '../components/StockQuiz';
import SocialMediaFeed from '../components/SocialMediaFeed';

interface HomePageProps {
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <StockSearch user={user} />
      
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <AskAI />
        <StockPortfolio user={user} />
        <NewsSection />
      </section>

      <section className="mt-8">
        <SocialMediaFeed user={user} />
      </section>
      
      <StockQuiz />
    </main>
  );
};

export default HomePage;