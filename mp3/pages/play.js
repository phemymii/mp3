/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import type {Node} from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   Dimensions,
   DeviceEventEmitter,
   TouchableOpacity,
   Image,
 } from 'react-native';
//  import { ProgressBar, Colors } from 'react-native-paper';
 import {
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
import { ProgressBar, Colors } from 'react-native-paper';
 import MusicFiles from 'react-native-get-music-files';
 let { width, height } = Dimensions.get('window')
 const guidelineBaseWidth = 350;
 const guidelineBaseHeight = 680;
 const scale = size => width / guidelineBaseWidth * size;
 const verticalScale = size => height / guidelineBaseHeight * size;
 const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
 import FastStorage from "react-native-fast-storage";
 import TrackPlayer from 'react-native-track-player';
//  import Equalizer from 'react-native-equalizer'
 
 class App extends React.Component{
      constructor(props){
        super(props)
        this.state = {
          song: this.props.route.params,
          playing: false,
          position: 0,
          duration: 0,
          duration2: 0,
        }
      }
 
 
     async componentDidMount(){
       const song = await FastStorage.getItem("currentAudio");
        console.log(this.props.route.params);
        console.log(this.state.song.path);
        this.start()
        const state = await TrackPlayer.getState();
        if (state === TrackPlayer.STATE_PLAYING) {
          this.setState({playing:true})
        };
       }

   start = async () => {
        // Set up the player
        await TrackPlayer.setupPlayer();
        // Add a track to the queue
        await TrackPlayer.add({
            id: this.state.song.id,
            url: 'file://'+this.state.song.path,
            title: this.state.song.title ? this.state.song.title : this.state.song.fileName ? this.state.song.fileName : this.state.song.album ? this.state.song.album : "<unknown>",
            artist: this.state.song.author ? this.state.song.author : "<unknown>",
            artwork: this.state.song.cover,
            album : this.state.song.album ? this.state.song.album : "<unknown>",
            date : this.state.song.date ? this.state.song.date : "<unknown>",
            duration : this.state.song.duration ? this.state.song.duration : "<unknown>",
        });
    
        // Start playing it
        await TrackPlayer.play()
        this.setState({playing:true})
        setInterval(() => {
          this.getProgress()
        this.getBufferedProgress()
        }, 1000);
        
    };

     tracks = async () => {
       await FastStorage.setItem("Audio", JSON.stringify(this.state.songs));
       // console.log(item);
     }

     getProgress = async() => {
       const position = await TrackPlayer.getPosition()
       this.setState({position:position})
     }
     getBufferedProgress  = async() => {
        const duration = await TrackPlayer.getDuration()
       this.setState({duration:duration - this.state.position, duration2:duration})
     }

     formatTime = (number) => {
        number = parseInt(number)
       var hours = String(Math.floor(number / 60)).length < 2 ? '0'+(Math.floor(number / 60) >= 0 ? Math.floor(number / 60) : 0) : Math.floor(number / 60) >= 0 ?  Math.floor(number / 60) : Math.floor(number / 60);  
       var minutes = String(number % 60).length < 2 ? '0'+(number % 60) : number % 60;
       return hours + ":" + minutes;         
     }
     
     
 
   render(){
     return(
       <SafeAreaView style={{flex:1}}>
           <StatusBar backgroundColor="white" barStyle="dark-content" />
           <ScrollView style={{flex:1}} contentContainerStyle={{ justifyContent: 'center'}}>
                 
                {/* <Text>{this.state.songs.length}</Text> */}
                 {/* {this.state.songs.map((a,b)=>{
                   return(
                 <TouchableOpacity key={b} style={styles.trackLists}>
                   <View>
                     <Image source={{uri: a.cover}} style={styles.image}/>
                   </View>
                   <View>
                     <Text>{a.title ? a.title : a.fileName ? a.fileName : a.author}</Text>
                   </View>
                 </TouchableOpacity>
                 )
                 })
                 } */}
              <View style={styles.container}>
              <View>
                <Image source={{uri: this.state.song.cover}} style={styles.cover}/>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text>{this.formatTime(Math.floor(this.state.position))}</Text>
                <Text style= {{marginLeft: '83%'}}>{this.formatTime(Math.floor(this.state.duration))}</Text>
                
              {/* <Text>{formatTime(this.state.song)}</Text> */}
                
              </View>
              {/* <Text>{(String(isNaN(this.state.position/this.state.duration) ? 0 : (this.state.position/this.state.duration)).substr(0,5))}</Text><Text>{(this.state.position)}</Text><Text>{(this.state.duration2)}</Text> */}
              <ProgressBar
                   progress={parseFloat((String(isNaN(this.state.position/this.state.duration2) ? 0 : (this.state.position/this.state.duration2)).substr(0,5)))} color={Colors.red900}  style={{marginTop: 3, marginBottom:20}}
                />
              <View style={styles.buttons}>
                <TouchableOpacity onPress={()=> this.skipToPrevious()}>
                  <Image source={require("../asset/png/iinext.png")} style={[styles.previous, {transform:[{rotate:'180deg'}]}]}/>
                </TouchableOpacity>
                {!this.state.playing?
                <TouchableOpacity onPress={()=> {TrackPlayer.play(); this.setState({playing:true})}}>
                  <Image source={require('../asset/png/play.png')} style={styles.play}/>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={()=> {TrackPlayer.pause(); this.setState({playing:false})}}>
                  <Image source={require('../asset/png/pause.png')} style={styles.play}/>
                </TouchableOpacity>}
                <TouchableOpacity  onPress={()=> TrackPlayer.skipToNext()}>
                  <Image source={require('../asset/png/iinext.png')} style={styles.next}/>
                </TouchableOpacity>
              </View>
              <View style={styles.containe}>
                  {/* <Equalizer maximumValue={100} data={{a: {value: 0, label: 'Bass'}, b: {value:50, label: 'Trible'}, c: {value: 50, label: 'Test'}}} /> */}
              </View>
              </View>
           </ScrollView>
       </SafeAreaView>
     )
   }
 }
 
 export default App;
 
 const styles = StyleSheet.create({
   trackLists: {
     backgroundColor: 'indigo',
     padding: 10,
     marginTop: 3,
     minHeight: 40
   },
   container: {
    flex: 1,
    alignSelf: 'center'

   },
   cover: {
     height: scale(300),
     width: scale(300),
     alignSelf: 'center'
   },
   buttons: {
    flex: 1,
    // backgroundColor:'yellow',
    // bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center'

   },
   play:{
    width: 70,
    height: 70,
    margin: 10
   },
   previous: {
    width: 50,
    height: 50,
    
   },
   next: {
    width: 50,
    height: 50
   },
   containe: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
},
 });
 
 
 