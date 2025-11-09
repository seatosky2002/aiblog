import RepoInputForm from './components/RepoInputForm';
import ActivityList from './components/ActivityList';
import { useGitHubActivity } from './hooks/useGitHubActivity';
import './App.css';

function App() {
  const { activities, isLoading, error, repoInfo, fetchGitHubActivity } = useGitHubActivity();

  return (
    <div className="app">
      <header className="app-header">
        <h1>GitHub 활동 블로그 생성기</h1>
        <p>GitHub 레포지토리의 커밋과 PR을 분석하여 자동으로 블로그를 생성합니다.</p>
      </header>

      <main className="app-main">
        <RepoInputForm onSubmit={fetchGitHubActivity} isLoading={isLoading} />

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>GitHub 활동 데이터를 가져오는 중...</p>
          </div>
        )}

        {!isLoading && activities.length > 0 && (
          <ActivityList activities={activities} repoInfo={repoInfo} />
        )}

        {!isLoading && !error && activities.length === 0 && repoInfo === null && (
          <div className="empty-state">
            <p>👆 위에서 GitHub 레포지토리를 입력해주세요</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

