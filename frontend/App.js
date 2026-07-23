/**
 * App.js — Root Navigation Setup
 * Story 2-2: Tích hợp React Navigation Native Stack
 *
 * Stack screens:
 *   - HomeDashboard (root)
 *   - CharacterProfile
 *   - QuestDetail  ← thêm mới cho Story 2-2
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { PostHogProvider } from 'posthog-react-native';
import { posthog } from './src/utils/analytics';

const SafePostHogProvider = ({ children }) => {
  if (Platform.OS === 'web' || !posthog) {
    return <>{children}</>;
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
import HomeDashboardScreen from './src/screens/HomeDashboardScreen';
import CharacterProfileScreen from './src/screens/CharacterProfileScreen';
import QuestDetailScreen from './src/screens/QuestDetailScreen';
import QuizScreen from './src/screens/QuizScreen';
import SessionSummaryScreen from './src/screens/SessionSummaryScreen';
import PvpLobbyScreen from './src/screens/PvpLobbyScreen';
import PvpMatchmakingScreen from './src/screens/PvpMatchmakingScreen';
import PvpBattleScreen from './src/screens/PvpBattleScreen';
import PvpResultScreen from './src/screens/PvpResultScreen';
import DungeonSelectionScreen from './src/screens/DungeonSelectionScreen';
import DungeonExamScreen from './src/screens/DungeonExamScreen';
import DungeonResultScreen from './src/screens/DungeonResultScreen';
import RankUpCeremonyScreen from './src/screens/RankUpCeremonyScreen';
import CareerMilestonesScreen from './src/screens/CareerMilestonesScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import AuthScreen from './src/screens/AuthScreen';
import GoalSettingScreen from './src/screens/GoalSettingScreen';
import PlacementTestScreen from './src/screens/PlacementTestScreen';
import PlacementResultScreen from './src/screens/PlacementResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <SafePostHogProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#12121d' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
            <Stack.Screen name="MainHub" component={HomeDashboardScreen} />
            <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
            <Stack.Screen name="PlacementTest" component={PlacementTestScreen} />
            <Stack.Screen name="PlacementResult" component={PlacementResultScreen} />
            <Stack.Screen name="CharacterProfile" component={CharacterProfileScreen} />
            <Stack.Screen name="QuestDetail" component={QuestDetailScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="SessionSummary" component={SessionSummaryScreen} />
            <Stack.Screen name="PvpLobby" component={PvpLobbyScreen} />
            <Stack.Screen name="PvpMatchmaking" component={PvpMatchmakingScreen} />
            <Stack.Screen name="PvpBattle" component={PvpBattleScreen} />
            <Stack.Screen name="PvpResult" component={PvpResultScreen} />
            <Stack.Screen name="DungeonSelection" component={DungeonSelectionScreen} />
            <Stack.Screen name="DungeonExam" component={DungeonExamScreen} />
            <Stack.Screen name="DungeonResult" component={DungeonResultScreen} />
            <Stack.Screen name="RankUpCeremony" component={RankUpCeremonyScreen} />
            <Stack.Screen name="CareerMilestones" component={CareerMilestonesScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          </Stack.Navigator>
        </SafePostHogProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
