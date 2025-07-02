
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Calendar, Flame, Trophy, Target } from "lucide-react";

const StreakTracker = () => {
  const [sessions] = useLocalStorage("mentalSessions", []);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStreakData = () => {
    const sessionDates = sessions.map(s => new Date(s.startTime).toDateString());
    const uniqueDates = [...new Set(sessionDates)];
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    // Calculate current streak
    const today = new Date();
    let checkDate = new Date(today);
    
    while (uniqueDates.includes(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // If no session today, check if yesterday had one
    if (currentStreak === 0 && uniqueDates.includes(new Date(today.getTime() - 86400000).toDateString())) {
      checkDate = new Date(today.getTime() - 86400000);
      while (uniqueDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
    
    // Calculate longest streak
    const sortedDates = uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    let tempStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { currentStreak, longestStreak, sessionDates: uniqueDates };
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const streakData = getStreakData();
  const calendarDays = getCalendarDays();

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { emoji: "🏆", label: "Legend", color: "text-purple-500" };
    if (streak >= 14) return { emoji: "🔥", label: "Beast", color: "text-red-500" };
    if (streak >= 7) return { emoji: "⚡", label: "Warrior", color: "text-orange-500" };
    if (streak >= 3) return { emoji: "🎯", label: "Fighter", color: "text-yellow-500" };
    return { emoji: "🌱", label: "Starter", color: "text-green-500" };
  };

  const currentLevel = getStreakLevel(streakData.currentStreak);
  const nextLevel = getStreakLevel(streakData.currentStreak + 1);

  return (
    <div className="space-y-6">
      {/* Current Streak Display */}
      <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-white">
              {streakData.currentStreak}
            </div>
            <div className="text-xl text-gray-300">
              {streakData.currentStreak === 1 ? 'day' : 'days'} in a row
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge className={`${currentLevel.color} bg-transparent border text-lg py-1 px-3`}>
                {currentLevel.emoji} {currentLevel.label}
              </Badge>
            </div>
            
            {streakData.currentStreak < 30 && (
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  {nextLevel.label === currentLevel.label ? 
                    `Keep going to maintain ${currentLevel.label} status!` :
                    `${Math.abs(getStreakLevel(streakData.currentStreak + 1).emoji.length - streakData.currentStreak)} more days to become ${nextLevel.emoji} ${nextLevel.label}`
                  }
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(streakData.currentStreak % 7) * (100/7)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold text-white">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-400">Longest Streak</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-white">{sessions.length}</div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-white">
              {Math.round((streakData.sessionDates.length / 30) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Month Consistency</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Activity Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="text-gray-400 hover:text-white"
              >
                ← Previous
              </button>
              <h3 className="text-lg font-semibold text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="text-gray-400 hover:text-white"
              >
                Next →
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-400 p-2 font-semibold">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => {
                const dateStr = day.toDateString();
                const hasSession = streakData.sessionDates.includes(dateStr);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = dateStr === new Date().toDateString();
                
                return (
                  <div
                    key={index}
                    className={`
                      p-2 text-xs rounded relative
                      ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
                      ${hasSession ? 'bg-green-600' : 'bg-gray-700'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    {day.getDate()}
                    {hasSession && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-gray-400">Session completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <span className="text-gray-400">No session</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakTracker;
