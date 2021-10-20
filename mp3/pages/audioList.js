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
   Navigator,
   TextInput,
   PermissionsAndroid,
   ActivityIndicator,
   FlatList
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';

 import MusicFiles from 'react-native-get-music-files';
 let { width, height } = Dimensions.get('window')
 const guidelineBaseWidth = 350;
 const guidelineBaseHeight = 680;
 const scale = size => width / guidelineBaseWidth * size;
 const verticalScale = size => height / guidelineBaseHeight * size;
 const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
 import FastStorage from "react-native-fast-storage";
var isEqual = require('lodash.isequal');

 class App extends React.PureComponent{
   constructor(props){
     super(props)
     this.state = {
       songs: [],
       saved: [],
       saved2: [],
       update: [],
       search: {}
     }
   }
   state = {
     songs: []
 
   }
 
 
     async componentDidMount(){
      
       const items = await FastStorage.getItem("Audio");
      console.log("this.state.songsssss");

         if(items && JSON.parse(items).length > 0){
           console.log('items');
           this.setState({saved : JSON.parse(items), saved2 : JSON.parse(items)}, () => 
           this.getMusic()
           )
         }else{

          this.getMusic()
         }
         this.requestStoragePermission()
       }
       UNSAFE_componentWillMount() {
       this.music()
     }

     componentWillUnmount(){
      this.getMusic()
      this.music()
      this.requestStoragePermission()
      this.tracks()
      this.first()
      // this.renderItem()
      // this.Item()
     }
 
     requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "We need access to write to your phone storage",
            message: "We need access to your phone storage",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log("You can use the Storage");
        } else {
          // console.log("Storage permission denied");
        }
        const granted2 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "We need access to write to your phone storage",
            message:
              "We need access to your phone storage",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log("You can use the Storage");
        } else {
          // console.log("Storage permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };

       getMusic = () => {
         MusicFiles.getAll({
           id : true,
           blured : false,
           artist : true,
           duration : true, //default : true
           cover : true, //default : true,
           title : true,
           cover : true,
           batchNumber : 5, //get 5 songs per batch
           minimumSongDuration : 30000, //in miliseconds,
           fields : ['title','artwork','duration','artist','genre','lyrics','albumTitle','path','cover']
         }).then(tracks => {
             
         }).catch(error => {
             // console.log(error);
         })
      }
 
    
     track = async () => {
       const o = await FastStorage.getItem("Audio")
       return(JSON.parse(o));
     }
 
    music = () => {
       DeviceEventEmitter.addListener(
         'onBatchReceived',
         (params) => {
             this.setState({songs : [
                 ...this.state.songs,
                 ...params.batch
             ]},() => this.tracks());
         }
       )
      }
 
     tracks = async () => {
      console.log("this.state.songs");

       await FastStorage.setItem("Audio", JSON.stringify(this.state.songs));
       console.log("this.state.songs");
      let ifEqual = isEqual(this.state.songs, this.state.saved)
			if (!ifEqual) {
        // this.setState({saved : this.state.songs, saved2 : this.state.songs})
      }
     }
     
     first = async () => {
      const items2 = await FastStorage.getItem("Audio");
         this.setState({saved : JSON.parse(items2)})
     }
 
   render(){
    const DATA = this.state.saved;
    const getItem = (data, index) => ({
      id: Math.random().toString(12).substring(0),
      title: `Item ${index+1}`
    });
    
    const getItemCount = (data) => this.state.saved.length;
    
    const Item = ({ title,  fileName, author, artwork, duration, artist, genre, lyrics, albumTitle, path, cover, onPress   }) => (
      <TouchableOpacity  style={styles.trackLists} onPress={onPress}>
        <View>
          <Image source={{uri: cover}} style={styles.image}/>
        </View>
        <View>
          <Text>{title ? title : fileName ? fileName : author}</Text>
        </View>
      </TouchableOpacity>
    );
    const renderItem = ({ item }) => (
      <Item 
      title={item.title} 
      artwork={item.artwork} 
      duration={item.duration} 
      genre={item.genre} 
      lyrics={item.lyrics} 
      albumTitle={item.albumTitle} 
      path={item.path} 
      cover={item.cover} 
      fileName={item.fileName} 
      author={item.author} 
      onPress={()=>this.props.navigation.navigate("Play", item)} 
      />
    );
    const setInput = (name, value) => {
			let {saved2, songs } = this.state
        let q = [];
        saved2.forEach(find => {
          if( find.title ? find.title.includes(value) : null || find.filename ? find.fileName.includes(value) : null || find.author ? find.author.includes(value) : null ){
            console.log(find.title);
          q.push(find)
        }
        });
        this.setState({saved : q})
		}
    
     return(
       <SafeAreaView>
           <StatusBar backgroundColor="white" barStyle="dark-content" />
           <View>
           <Text>{this.state.saved.length}</Text>
             <TextInput
									style={styles.input}
									status='primary'
									placeholder='Search'
									size='small'
                  selectable={true}
									placeholderTextColor={'#666'}
									onChangeText={val => setInput('search', val)}
									ref="search"
								/>
           </View>
           {/* {this.state.saved.length < 1 ?
           <ActivityIndicator size="large" color="#000000" />
           : */}
           <View>
           {/* <VirtualizedList
                   data={DATA}
                   initialNumToRender={4}
                   renderItem={({ item }) => <Item title={item.title} />}
                   keyExtractor={item => item.key}
                   getItemCount={getItemCount}
                   getItem={getItem}
           
                  /> */}
            <FlatList
              data={this.state.saved}
              initialNumToRender={200}
              renderItem={renderItem}
              keyExtractor={item => item.id}

            />
           <ScrollView>
                 {/* {this.state.saved.map((a,b)=>{
                   return(
                     <TouchableOpacity key={b}  style={styles.trackLists} onPress={()=>this.props.navigation.navigate("Play", a)}>
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

                
             
           </ScrollView>
           </View>
          {/* } */}
       </SafeAreaView>
     )
   }
 }
 
 export default App;
 
 const styles = StyleSheet.create({
   trackLists: {
    //  backgroundColor: 'indigo',
      elevation: 3,
      borderRadius: 14,
     margin:6,
     padding: 6,
     marginTop: 3,
    //  minHeight: 40
   },
   input: {
		borderRadius: 10,
		// backgroundColor: 'red',
		borderWidth: 0,
		borderColor: 'gray',
    borderWidth: 1,
    height: 40
	},
   image: {
     height: 40,
     width: 40
   },
   item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 32,
  },
 }); 