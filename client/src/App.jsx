import { useState } from 'react';
import axios from 'axios';
import RepoInputForm from './components/RepoInputForm';
import './App.css';

const API_BASE_URL = 'http://localhost:4000';

function App() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoInfo, setRepoInfo] = useState(null);

  const fetchGitHubActivity = async ({ owner, repo }) => {
    setIsLoading(true);
    setError('');
    setActivities([]);

    try {
      // 서버 API 호출
      const response = await axios.get(
        `${API_BASE_URL}/api/github/activity/${owner}/${repo}`
      );

      setActivities(response.data);
      setRepoInfo({ owner, repo });
    } catch (err) {
      console.error('Error fetching GitHub activity:', err);
      setError(
        err.response?.data?.message ||
        '데이터를 가져오는 중 오류가 발생했습니다. 레포지토리 이름을 확인해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="results">
            <h2>
              {repoInfo.owner}/{repoInfo.repo} 활동 내역
            </h2>
            <p className="results-count">총 {activities.length}개의 활동</p>

            <div className="activity-list">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-type-badge">
                    {activity.type === 'commit' ? '📝 커밋' : '🔀 PR'}
                  </div>

                  {activity.type === 'commit' ? (
                    <>
                      <div className="activity-content">
                        <p className="activity-message">{activity.message}</p>
                        <div className="activity-meta">
                          <span className="author">{activity.author}</span>
                          <span className="date">
                            {new Date(activity.date).toLocaleString('ko-KR')}
                          </span>
                        </div>
                      </div>
                      <a
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="activity-link"
                      >
                        보기
                      </a>
                    </>
                  ) : (
                    <>
                      <div className="activity-content">
                        <p className="activity-title">
                          #{activity.number} {activity.title}
                        </p>
                        <span className={`pr-state ${activity.state}`}>
                          {activity.state === 'open' ? '열림' : '닫힘'}
                        </span>
                        <div className="activity-meta">
                          <span className="author">{activity.author}</span>
                          <span className="date">
                            {new Date(activity.date).toLocaleString('ko-KR')}
                          </span>
                        </div>
                      </div>
                      <a
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="activity-link"
                      >
                        보기
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
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

