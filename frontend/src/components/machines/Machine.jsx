// import InfiniteScroll from 'react-infinite-scroll-component';
// import React from "react";
// import { MailCheckIcon } from 'lucide-react';
// import axiosClient from '../../utils/axiosClient';
// import {useState, useEffect} from "react";

// const style = {
//   height: 30,
//   border: "1px solid green",
//   margin: 6,
//   padding: 8
// };

// // store searched result in redux.store, but later implement usnig this, currently doing using simple db call


// const fetchTools = async ({ page = 1, limit = 10, category, sort, order, search }) => {
//   const params = { page, limit, category, sort, order, search };
//   const { data } = await axiosClient.get('/', { params });
//   return data;
// };

// useEffect(fetchTools(),params);

// const Machine = async()=>{
//   class App extends React.Component {
//     state = {
//       items: Array.from({ length: 20 }),
//       hasMore: true
//     };

//     fetchMoreData = () => {
//       if (this.state.items.length >= 500) {
//         this.setState({ hasMore: false });
//         return;
//       }
//       // a fake async api call like which sends
//       // 20 more records in .5 secs
//       setTimeout(() => {
//         this.setState({
//           items: this.state.items.concat(Array.from({ length: 20 }))
//         });
//       }, 500);
//     };

//     render() {
//       return (
//         <div>
//           <h1>demo: react-infinite-scroll-component</h1>
//           <hr />
//           <InfiniteScroll
//             dataLength={this.state.items.length}
//             next={this.fetchMoreData}
//             hasMore={this.state.hasMore}
//             loader={<h4>Loading...</h4>}
//             height={400}
//             endMessage={
//               <p style={{ textAlign: "center" }}>
//                 <b>Yay! You have seen it all</b>
//               </p>
//             }
//           >
//             {this.state.items.map((i, index) => (
//               <div style={style} key={index}>
//                 div - #{index}
//               </div>
//             ))}
//           </InfiniteScroll>
//         </div>
//       );
//     }
//   }

// }

// export default Machine;