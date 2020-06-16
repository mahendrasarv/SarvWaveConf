import React from 'react';

const documentList = (props) => {
	
	const docList = props.documents.map( docInfo => {
		return (

			<div class="doc-thumb-col2" >
	           <img src="images/video-thumb.png" class="video-thumb"    alt=""/>
	           <div class="thumb-title">Sarv Video Conferencing</div>
	            <ul>
	              <li><button className="bgskyblue"  >
	              <FontAwesomeIcon icon={['fas', 'pen']} /> 
	              <span class="tooltip-ex-text tooltip-ex-bottom">Collaborative</span>
	              </button>

	              </li>
	              <li> 
	              <button className="bgred" data-toggle="tooltip" data-placement="bottom" title="Presentation">
	              <FontAwesomeIcon icon={['fas', 'chalkboard-teacher']} /> 
	               <span class="tooltip-ex-text tooltip-ex-bottom">Presentation</span>
	               </button></li>
	              <li>
	              <button className="bgperple" data-toggle="tooltip" data-placement="bottom" title="File Sharing" >
	                <FontAwesomeIcon icon={['fas', 'share-alt']} /> 
	                <span class="tooltip-ex-text tooltip-ex-bottom">File Sharing</span> 
	                </button></li>
	           </ul>
	        </div>

		);
	});

	return docList;


}

export default documentList;