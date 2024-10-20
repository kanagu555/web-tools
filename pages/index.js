import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../src/components/Header';
import MainContent from '../src/components/MainContent';

export default function Home() {
  return (
    <div className={styles.container}>
     <Header />
     <MainContent />
    </div>
  );
}
