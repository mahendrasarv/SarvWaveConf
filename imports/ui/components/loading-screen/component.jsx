import React from 'react';
import { styles } from './styles.scss';

const LoadingScreen = ({ children }) => (
  <div className={styles.background}>
  <div className="text-center"><img src="images/sarv-wave-white-bg.png" width="350" alt="" /><br/>
 <img src="images/loading.svg" className={styles.loadingimg}  width="180" alt="" />
  </div>
  
   
    <div className={styles.message}>
      {children}
    </div>
  </div>
);

export default LoadingScreen;
