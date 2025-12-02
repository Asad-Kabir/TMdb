// import React, { useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '@navigation/types';
// import { COLORS } from '@styles/colors';
// import { FONTS, FONT_SIZES } from '@styles/typography';

// type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

// const VideoPlayerScreen = ({ navigation, route }: Props) => {
//   const { videoKey } = route.params; // ye YouTube ID hai (jaise: abc123xyz)
//   const playerRef = useRef<any>(null);

//   const [playing, setPlaying] = useState(true);

//   const onStateChange = (state: string) => {
//     console.log('Player state:', state);

//     if (state === 'ended') {
//       navigation.goBack();
//     }

//     // Agar user manually fullscreen se bahar aaya to wapas daal do
//     if (state === 'paused' || state === 'buffering') {
//       // optional: agar pause hua to bhi fullscreen mein rakho
//     }
//   };

//   const onFullScreenChange = (isFullscreen: boolean) => {
//     console.log('isFullscreen', isFullscreen);
//     if (!isFullscreen) {
//       // Agar user fullscreen se bahar nikal gaya to wapas daal do
//       setTimeout(() => {
//         playerRef.current?.enterFullScreen();
//       }, 300);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />

//       {/* Done Button */}
//       <TouchableOpacity
//         style={styles.doneButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={styles.doneText}>Done</Text>
//       </TouchableOpacity>

//       <YoutubePlayer
//         ref={playerRef}
//         height="100%"
//         width="100%"
//         play={playing}
//         videoId={videoKey}
//         initialPlayerParams={{
//           preventFullScreen: false, // Important for iOS
//           controls: true,
//           rel: false,
//           showinfo: false,
//         }}
//         forceAndroidAutoplay={true} // Android silent autoplay
//         webViewStyle={{ opacity: 0.99 }} // iOS autoplay trick
//         webViewProps={{
//           allowsInlineMediaPlayback: true,
//           mediaPlaybackRequiresUserAction: false,
//           allowsFullscreenVideo: true,
//         }}
//         onChangeState={onStateChange}
//         onFullScreenChange={onFullScreenChange} // Yeh bohot zaroori hai
//       />

//       {/* <YoutubePlayer
//         height={1000}
//         width="100%"
//         play={true}
//         videoId={videoKey}
//         viewContainerStyle={{
//           flex: 1,
//           backgroundColor:'red',
//           marginTop:100
//         }}
//         webViewStyle={{
//           backgroundColor:'blue'
//         }}
//         onChangeState={(event) => {
//           if (event === 'ended') {
//             navigation.goBack();               // video khatam → screen band
//           }
//         }}
//         webViewStyle={{ opacity: 0.99 }}        // chhota sa trick full screen ke liye
//         forceAndroidClient={true}
//       /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     alignItems: 'center',
//   },
//   doneButton: {
//     position: 'absolute',
//     top: 50,
//     right: 20,
//     zIndex: 10,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   doneText: {
//     fontFamily: FONTS.semiBold,
//     fontSize: FONT_SIZES.md,
//     color: COLORS.white,
//   },
// });

// export default VideoPlayerScreen;

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { COLORS } from '@styles/colors';
import { FONTS, FONT_SIZES } from '@styles/typography';
import Orientation from 'react-native-orientation-locker'; // Yeh add karna zaroori hai

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

const VideoPlayerScreen = ({ navigation, route }: Props) => {
  const { videoKey } = route.params;
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(true);

  // Component mount hote hi: Landscape lock + Fullscreen force
  useEffect(() => {
    StatusBar.setHidden(true);
    Orientation.lockToLandscapeLeft(); // ya lockToLandscape()

    // Player ready hone ke baad fullscreen kar do
    const timer = setTimeout(() => {
      playerRef.current?.enterFullScreen?.();
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      Orientation.unlockAllOrientations();
      StatusBar.setHidden(false);
    };
  }, []);

  const onStateChange = (state: string) => {
    console.log('YouTube State:', state);
    if (state === 'ended') {
      navigation.goBack();
    }
  };

  const onFullScreenChange = (isFullscreen: boolean) => {
    console.log('Fullscreen:', isFullscreen);
    if (!isFullscreen) {
      // Agar user ne fullscreen se bahar nikala → wapas daal do
      setTimeout(() => {
        playerRef.current?.enterFullScreen?.();
      }, 300);
    }
  };

  return (
    <View style={styles.container}>
      {/* Done Button - Fullscreen mein bhi dikhega */}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>

      <YoutubePlayer
        ref={playerRef}
        height="100%"
        width="100%"
        videoId={videoKey}
        play={playing}
        forceAndroidAutoplay={true}
        playThroughEarphone={false}
        initialPlayerParams={{
          controls: true,
          rel: false,
          showinfo: false,
          modestbranding: true,
          preventFullScreen: false,     // iOS ke liye zaroori
        }}
        webViewStyle={{ opacity: 0.99 }} // iOS silent autoplay trick
        webViewProps={{
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
          allowsFullscreenVideo: true,
        }}
        onChangeState={onStateChange}
        onFullScreenChange={onFullScreenChange} // Yeh sabse important hai!
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  doneButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  doneText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
  },
});

export default VideoPlayerScreen;
