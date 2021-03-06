/*
 * � Copyright IBM Corp. 2013
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0 
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */

/**
 * JavaScript API for IBM Connections Profile Service.
 * 
 * @module sbt.connections.ProfileService
 */
define([ "../declare", "../lang", "../config", "../stringUtil", "./ProfileConstants", "../base/BaseService", "../base/BaseEntity", "../base/XmlDataHandler", "../base/VCardDataHandler", "../Cache", "../util"  ], function(
        declare,lang,config,stringUtil,consts,BaseService,BaseEntity,XmlDataHandler, VCardDataHandler, Cache, util) {

	var updateProfileXmlTemplate = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><entry xmlns:app=\"http://www.w3.org/2007/app\" xmlns:thr=\"http://purl.org/syndication/thread/1.0\" xmlns:fh=\"http://purl.org/syndication/history/1.0\" xmlns:snx=\"http://www.ibm.com/xmlns/prod/sn\" xmlns:opensearch=\"http://a9.com/-/spec/opensearch/1.1/\" xmlns=\"http://www.w3.org/2005/Atom\"><category term=\"profile\" scheme=\"http://www.ibm.com/xmlns/prod/sn/type\"></category><content type=\"text\">\nBEGIN:VCARD\nVERSION:2.1\n${jobTitle}${address}${telephoneNumber}${building}${floor}END:VCARD\n</content></entry>";
    var updateProfileAttributeTemplate = "${attributeName}:${attributeValue}\n";
    var updateProfileAddressTemplate = "ADR;WORK:;;${streetAddress},${extendedAddress};${locality};${region};${postalCode};${countryName}\n";
    var createProfileTemplate = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><entry xmlns:app=\"http://www.w3.org/2007/app\" xmlns:thr=\"http://purl.org/syndication/thread/1.0\" xmlns:fh=\"http://purl.org/syndication/history/1.0\" xmlns:snx=\"http://www.ibm.com/xmlns/prod/sn\" xmlns:opensearch=\"http://a9.com/-/spec/opensearch/1.1/\" xmlns=\"http://www.w3.org/2005/Atom\"><category term=\"profile\" scheme=\"http://www.ibm.com/xmlns/prod/sn/type\"></category><content type=\"application/xml\"><person xmlns=\"http://ns.opensocial.org/2008/opensocial\"><com.ibm.snx_profiles.attrib>${guid}${email}${uid}${distinguishedName}${displayName}${givenNames}${surname}${userState}</com.ibm.snx_profiles.attrib></person></content></entry>";
    var createProfileAttributeTemplate = "<entry><key>${attributeName}</key><value><type>text</type><data>${attributeValue}</data></value></entry>";
   
    var OAuthString = "/oauth";
    var basicAuthString = "";
    var defaultAuthString = "";
    
    /**
     * Profile class.
     * 
     * @class Profile
     * @namespace sbt.connections
     */
    var Profile = declare(BaseEntity, {

        /**
         * 
         * @constructor
         * @param args
         */
        constructor : function(args) {            
        },

        /**
         * Get id of the profile
         * 
         * @method getUserid
         * @return {String} id of the profile
         * 
         */
        getUserid : function() {
            return this.getAsString("userid");
        },

        /**
         * Get name of the profile
         * 
         * @method getName
         * @return {String} name of the profile
         * 
         */
        getName : function() {
            return this.getAsString("name");
        },

        /**
         * Get email of the profile
         * 
         * @method getEmail
         * @return {String} email of the profile
         */
        getEmail : function() {
            return this.getAsString("email");
        },

        /**
         * Get groupware mail of the profile
         * 
         * @method getGroupwareMail
         * @return {String} groupware mail of the profile
         */
        getGroupwareMail : function() {
            return this.getAsString("groupwareMail");
        },

        /**
         * Get thumbnail URL of the profile
         * 
         * @method getThumbnailUrl
         * @return {String} thumbnail URL of the profile
         */
        getThumbnailUrl : function() {
            return this.getAsString("photoUrl");
        },

        /**
         * Get job title of the profile
         * 
         * @method getJobTitle
         * @return {String} job title of the profile
         */
        getJobTitle : function() {
            return this.getAsString("jobTitle");
        },

        /**
         * Get department of the profile
         * 
         * @method getDepartment
         * @return {String} department of the profile
         */
        getDepartment : function() {
            return this.getAsString("organizationUnit");
        },

        /**
         * Get address of the profile
         * 
         * @method getAddress
         * @return {Object} Address object of the profile
         */
        getAddress : function() {
            return this.getAsObject(consts.AddressFields);
        },
        /**
         * Get telephone number of the profile
         * 
         * @method getTelephoneNumber
         * @return {String} Phone number of the profile
         */
        getTelephoneNumber : function() {
            return this.getAsString("telephoneNumber");
        },

        /**
         * Get profile URL of the profile
         * 
         * @method getProfileUrl
         * @return {String} profile URL of the profile
         */
        getProfileUrl : function() {
            return this.getAsString("fnUrl");
        },
        /**
         * Get building name of the profile
         * 
         * @method getBuilding
         * @return {String} building name of the profile
         */
        getBuilding : function() {
            return this.getAsString("building");
        },
        /**
         * Get floor address of the profile
         * 
         * @method getFloor
         * @return {String} floor address of the profile
         */
        getFloor : function() {
            return this.getAsString("floor");
        },

        /**
         * Get Pronunciation URL of the profile
         * 
         * @method getPronunciationUrl
         * @return {String} Pronunciation URL of the profile
         */
        getPronunciationUrl : function() {
            return this.getAsString("soundUrl");
        },

        /**
         * Get summary of the profile
         * 
         * @method getSummary
         * @return {String} description of the profile
         */
        getSummary : function() {
            return this.getAsString("summary");
        },

        /**
         * Set work phone number of the profile in the field object
         * 
         * @method setTelephoneNumber
         * @param {String} telephoneNumber work phone number of the profile
         */
        setTelephoneNumber : function(telephoneNumber) {
            this.setAsString("telephoneNumber", telephoneNumber);
        },
        
        /**
         * Set building of the profile in the field object
         * 
         * @method setBuilding
         * @param {String} building building name of the profile
         */
        setBuilding : function(building) {
            this.setAsString("building", building);
        },
        
        /**
         * Set floor number of the profile in the field object
         * 
         * @method setFloor
         * @param {String} floor floor number of the profile
         */
        setFloor : function(floor) {
            this.setAsString("floor", floor);
        },

        /**
         * Set job title of the profile in the field object
         * 
         * @method setJobTitle
         * @param {String} title job title of the profile
         */
        setJobTitle : function(title) {
            this.setAsString("jobTitle", title);
        },

        /**
         * Set the location of the file input element in the markup for editing
         * profile photo in the field object
         * 
         * @method setPhotoLocation
         * @param {String} imgLoc location of the file input element
         */
        setPhotoLocation : function(imgLoc) {
            this.setAsString("imageLocation", imgLoc);
        },

        /**
         * Set the address of the profile in the field object
         * 
         * @method setAddress
         * @param {Object} address Address object of the profile.
         */
        setAddress : function(address) {
            this.setAsObject(address);
        },

        /**
         * Loads the profile object with the profile entry document associated
         * with the profile. By default, a network call is made to load the
         * profile entry document in the profile object.
         * 
         * @method load
         * @param {Object} [args] Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         * 
         */
        load : function(args) {        	
            var profileId = this.getUserid() || this.getEmail();
            var promise = this.service._validateProfileId(profileId);
            if (promise) {
                return promise;
            }

            var self = this;
            var callbacks = {
                createEntity : function(service,data,response) {
                    self.dataHandler = new XmlDataHandler({
                        data : data,
                        namespaces : consts.Namespaces,
                        xpath : consts.ProfileXPath
                    });
                    self.id = self.dataHandler.getEntityId();
                    return self;
                }
            };
            var requestArgs = {};
            if (this.service.isEmail(profileId)) {
            	requestArgs.email = profileId;
            } else {
            	requestArgs.userid = profileId;
            }            	
            lang.mixin(requestArgs, args || {});            
            var options = {
                handleAs : "text",
                query : requestArgs
            };
            
            var url = this.service.constructUrl(consts.AtomProfileDo, {}, {authType : this.service._getProfileAuthString()});
            return this.service.getEntity(url, options, profileId, callbacks, args);
        },

        /**
         * Updates the profile of a user.
         * 
         * @method update
         * @param {Object} [args] Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        update : function(args) {
        	return this.service.updateProfile(this, args);
        },
        /**
         * Get colleagues of the profile.
         * 
         * @method getColleagues
         * @param {Object} [args] Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getColleagues : function(args){
        	return this.service.getColleagues(this, args);
        },
        /**
         * Get colleague connections of the profile.
         * 
         * @method getColleagueConnections
         * @param {Object} [args] Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getColleagueConnections : function(args){
        	return this.service.getColleagueConnections(this, args);
        }
    });
    
    /**
     * ColleagueConnection class.
     * 
     * @class ConnectionEntry
     * @namespace sbt.connections
     */
    var ColleagueConnection = declare(BaseEntity, {

        /**
         * 
         * @constructor
         * @param args
         */
        constructor : function(args) {            
        },

        /**
         * Get id of the profile
         * 
         * @method getAuthorUserId
         * @return {String} author id of the profile
         * 
         */
        getAuthorUserId : function() {
            return this.getAsString("authorUserid");
        },
        
        /**
         * Get id of the profile
         * 
         * @method getContributorUserId
         * @return {String} contributor id of the profile
         * 
         */
        getContributorUserId : function() {
            return this.getAsString("contributorUserid");
        },

        /**
         * Get name of the profile
         * 
         * @method getAuthorName
         * @return {String} author name of the profile
         * 
         */
        getAuthorName : function() {
            return this.getAsString("authorName");
        },
        
        /**
         * Get name of the profile
         * 
         * @method getAuthorName
         * @return {String} contributor name of the profile
         * 
         */
        getContributorName : function() {
            return this.getAsString("contributorName");
        },

        /**
         * Get email of the profile
         * 
         * @method getAuthorEmail
         * @return {String} contributor email of the profile
         */
        getAuthorEmail : function() {
            return this.getAsString("authorEmail");
        },
        
        /**
         * Get email of the profile
         * 
         * @method getContributorEmail
         * @return {String} contributor email of the profile
         */
        getContributorEmail : function() {
            return this.getAsString("contributorEmail");
        },

        /**
         * Get job title of the profile
         * 
         * @method getTitle
         * @return {String} job title of the profile
         */
        getTitle : function() {
            return this.getAsString("title");
        },
        
        /**
         * Get job title of the profile
         * 
         * @method getContent
         * @return {String} content of the profile
         */
        getContent : function() {
            return this.getAsString("content");
        },

        /**
         * Get profile URL of the profile
         * 
         * @method getSelfLink
         * @return {String} profile URL of the profile
         */
        
        getSelfLink : function() {
            return this.getAsString("selfLink");
        },
        
        /**
         * Get profile URL of the profile
         * 
         * @method getEditLink
         * @return {String} profile URL of the profile
         */
        
        getEditLink : function() {
            return this.getAsString("editLink");
        },
        
        /**
         * Get profile URL of the profile
         * 
         * @method getUpdated
         * @return {String} profile URL of the profile
         */
        
        getUpdated : function() {
            return this.getAsString("updated");
        }

    });

    /**
     * ProfileTag class.
     * 
     * @class ProfileTag
     * @namespace sbt.connections
     */
    var ProfileTag = declare(BaseEntity, {

        /**
         * 
         * @constructor
         * @param args
         */
        constructor : function(args) {            
        },

        /**
         * Get term of the profile tag
         * 
         * @method getTerm
         * @return {String} term of the profile tag
         * 
         */
        getTerm : function() {
            return this.getAsString("term");
        },
        
        /**
         * Get frequency of the profile tag
         * 
         * @method getFrequency
         * @return {Number} frequency of the profile tag
         * 
         */
        getFrequency : function() {
            return this.getAsNumber("frequency");
        },
        
        /**
         * Get intensity of the profile tag
         * 
         * @method getIntensity
         * @return {Number} intensity of the profile tag
         * 
         */
        getIntensity : function() {
            return this.getAsNumber("intensity");
        },
        
        /**
         * Get visibility of the profile tag
         * 
         * @method getVisibility
         * @return {Number} visibility of the profile tag
         * 
         */
        getVisibility : function() {
            return this.getAsNumber("visibility");
        }
        
    });
    
    /**
     * Callbacks used when reading an entry that contains a Profile.
     */
    var ProfileCallbacks = {
        createEntity : function(service,data,response) {
            var entryHandler = null;
            if (response.args && response.args.format == "vcard") {
                entryHandler = new VCardDataHandler({
                    data : data,
                    namespaces : consts.Namespaces,
                    xpath : consts.ProfileVCardXPath
                });
            } else {
                entryHandler = new XmlDataHandler({
                    data : data,
                    namespaces : consts.Namespaces,
                    xpath : consts.ProfileXPath
                });
            }
            return new Profile({
                service : service,
                id : entryHandler.getEntityId(),
                dataHandler : entryHandler
            });
        }
    };
    
    /**
     * Callbacks used when reading a feed that contains Profile entries.
     */
    var ProfileFeedCallbacks = {
        createEntities : function(service,data,response) {
            return new XmlDataHandler({
                data : data,
                namespaces : consts.Namespaces,
                xpath : consts.ProfileFeedXPath
            });
        },
        createEntity : function(service,data,response) {
            var entryHandler = null;
            if (response.args && response.args.format == "vcard") {
                entryHandler = new VCardDataHandler({
                    data : data,
                    namespaces : consts.Namespaces,
                    xpath : consts.ProfileVCardXPath
                });
            } else {
                entryHandler = new XmlDataHandler({
                    data : data,
                    namespaces : consts.Namespaces,
                    xpath : consts.ProfileXPath
                });
            }
            return new Profile({
                service : service,
                id : entryHandler.getEntityId(),
                dataHandler : entryHandler
            });
        }
    };
    
    /**
     * Callbacks used when reading a feed that contains ColleagueConnections
     */
    var ColleagueConnectionFeedCallbacks = {
        createEntities : function(service,data,response) {
            return new XmlDataHandler({
                data : data,
                namespaces : consts.Namespaces,
                xpath : consts.ProfileFeedXPath
            });
        },
        createEntity : function(service,data,response) {
            var entryHandler = null;
            entryHandler = new XmlDataHandler({
                data : data,
                namespaces : consts.Namespaces,
                xpath : consts.ColleagueConnectionXPath
            });
            return new ColleagueConnection({
                service : service,
                id : entryHandler.getEntityId(),
                dataHandler : entryHandler
            });
        }
    };
    
    /**
     * Callbacks used when reading a feed that contains Profile Tag entries.
     */
    var ProfileTagFeedCallbacks = {
        createEntities : function(service,data,response) {
            return new XmlDataHandler({
                data : data,
                namespaces : consts.Namespaces,
                xpath : consts.ProfileTagsXPath
            });
        },
        createEntity : function(service,data,response) {
            var entryHandler = new XmlDataHandler({
                data : data,
                namespaces : consts.Namespaces,
                xpath : consts.ProfileTagsXPath
            });
            return new ProfileTag({
                service : service,
                id : entryHandler.getEntityId(),
                dataHandler : entryHandler
            });
        }
    };
    
    /**
     * ProfileService class.
     * 
     * @class ProfileService
     * @namespace sbt.connections
     */
    var ProfileService = declare(BaseService, {
        
        contextRootMap: {
            profiles: "profiles"
        },

        /**
         * 
         * @constructor
         * @param args
         */
        constructor : function(args) {
        	if (!this.endpoint) {
                this.endpoint = config.findEndpoint(this.getDefaultEndpointName());
            }
        	if(!this._cache){
        		if(config.Properties.ProfileCacheSize || consts.DefaultCacheSize){
        			this._cache = new Cache(config.Properties.ProfileCacheSize || consts.DefaultCacheSize);
        		}        		
        	}            
        },
        
        /**
         * Return the default endpoint name if client did not specify one.
         * @returns {String}
         */
        getDefaultEndpointName: function() {
            return "connections";
        },
        
        /**
        * Create a Profile object with the specified data.
        * 
        * @method newProfile
        * @param {Object} args Object containing the fields for the 
        *            new Profile 
        */
        newProfile : function(args) {
            return this._toProfile(args);
        },

        /**
         * Get the profile of a user.
         * 
         * @method getProfile
         * @param {String} userIdOrEmail Userid or email of the profile
         * @param {Object} [args] Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getProfile : function(userIdOrEmail, args) {           
        	var profile = this._toProfile(userIdOrEmail);
            var promise = this._validateProfile(profile);
            if (promise) {
                return promise;
            }
            return profile.load(args);
        },
        
        /**
         * Update an existing profile
         * 
         * @method updateProfile
         * @param {Object} profileOrJson Profile object to be updated
         * @param {Object} [args] Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        updateProfile : function(profileOrJson,args) {
            var profile = this._toProfile(profileOrJson);
            var promise = this._validateProfile(profile);
            if (promise) {
                return promise;
            }

            var requestArgs = {};
            profile.getUserid() ? requestArgs.userid = profile.getUserid() : requestArgs.email = profile.getEmail();
            lang.mixin(requestArgs, args || {});
            
            var callbacks = {};
            callbacks.createEntity = function(service,data,response) {                
                return profile;              
            };
            
            var options = {
                    method : "PUT",
                    query : requestArgs,
                    headers : consts.AtomXmlHeaders,
                    data : this._constructProfilePostData(profile)
                };   
            var url = this.constructUrl(consts.AtomProfileEntryDo, {}, {authType : this._getProfileAuthString()});

            return this.updateEntity(url, options, callbacks, args);
        },      
        
        /**
         * Get the tags for the specified profile
         * 
         * @method getTags
         * @param {String} id userId/email of the profile
         * @param {Object} args Object representing various query parameters that can be passed. The parameters must 
         * be exactly as they are supported by IBM Connections.
         */
        getTags : function(id, args) {
            // detect a bad request by validating required arguments
            var idObject = this._toTargetObject(id);
            var promise = this._validateTargetObject(idObject);
            if (promise) {
                return promise;
            }
            
            var options = {
                method : "GET",
                handleAs : "text",
                query : lang.mixin(idObject, args || {})
            };
            var url = this.constructUrl(consts.AtomTagsDo, {}, {authType : this._getProfileAuthString()});

            return this.getEntities(url, options, this.getProfileTagFeedCallbacks(), args);
        },
        
        /**
         * Get the colleagues for the specified profile
         * 
         * @method getColleagues
         * @param {String} id userId/email of the profile
         * @param {Object} args Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getColleagues : function(id, args) {
            // detect a bad request by validating required arguments
            var idObject = this._toIdObject(id);
            var promise = this._validateIdObject(idObject);
            if (promise) {
                return promise;
            }
            
            var requestArgs = lang.mixin(idObject, {
                connectionType : "colleague",
                outputType : "profile"
            }, args || {});
            var options = {
                method : "GET",
                handleAs : "text",
                query : requestArgs
            };
            var url = this.constructUrl(consts.AtomConnectionsDo, {}, {authType : this._getProfileAuthString()});
            return this.getEntities(url, options, this.getProfileFeedCallbacks(), args);
        },
        
        /**
         * Get the colleagues for the specified profile as Collegue Connection entries
         * 
         * @method getColleagueConnections
         * @param {String} id userId/email of the profile
         * @param {Object} args Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getColleagueConnections : function(id, args) {
            // detect a bad request by validating required arguments
            var idObject = this._toIdObject(id);
            var promise = this._validateIdObject(idObject);
            if (promise) {
                return promise;
            }
            
            var requestArgs = lang.mixin(idObject, {
                connectionType : "colleague",
				outputType : "connection"
            }, args || {});
            var options = {
                method : "GET",
                handleAs : "text",
                query : requestArgs
            };
            var url = this.constructUrl(consts.AtomConnectionsDo, {}, {authType : this._getProfileAuthString()});
            return this.getEntities(url, options, this.getColleagueConnectionFeedCallbacks(), args);
        },
        
        /**
         * Get the reporting chain for the specified person.
         * 
         * @method getReportingChain
         * @param {String} id userId/email of the profile
         * @param {Object} args Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getReportingChain : function(id, args) {
            // detect a bad request by validating required arguments
            var idObject = this._toIdObject(id);
            var promise = this._validateIdObject(idObject);
            if (promise) {
                return promise;
            }
            
            var requestArgs = lang.mixin(idObject, args || {});
            var options = {
                method : "GET",
                handleAs : "text",
                query : requestArgs
            };
            var url = this.constructUrl(consts.AtomReportingChainDo, {}, {authType : this._getProfileAuthString()});
            return this.getEntities(url, options, this.getProfileFeedCallbacks(), args);
        },
        
        /**
         * Get the people managed for the specified person.
         * 
         * @method getPeopleManaged
         * @param {String} id userId/email of the profile
         * @param {Object} args Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        getPeopleManaged : function(id, args) {
            // detect a bad request by validating required arguments
            var idObject = this._toIdObject(id);
            var promise = this._validateIdObject(idObject);
            if (promise) {
                return promise;
            }
            
            var requestArgs = lang.mixin(idObject, args || {});
            var options = {
                method : "GET",
                handleAs : "text",
                query : requestArgs
            };
            var url = this.constructUrl(consts.AtomPeopleManagedDo, {}, {authType : this._getProfileAuthString()});
            return this.getEntities(url, options, this.getProfileFeedCallbacks(), args);
        },
                
        /**
         * Search for a set of profiles that match a specific criteria and return them in a feed.
         * 
         * @method search
         * @param {Object} args Object representing various query parameters
         *            that can be passed. The parameters must be exactly as they are
         *            supported by IBM Connections.
         */
        search : function(args) {
            // detect a bad request by validating required arguments
            if (!args) {
            	return this.createBadRequestPromise("Invalid arguments, one or more of the input parameters to narrow the search must be specified.");
            }
            
            var options = {
                method : "GET",
                handleAs : "text",
                query : args
            };
            var url = this.constructUrl(consts.AtomSearchDo, {}, {authType : this._getProfileAuthString()});
            return this.getEntities(url, options, this.getProfileFeedCallbacks(), args);
        },
        
        /**
		 * Updates the profile photo of a user.
		 * @method updateProfilePhoto
		 * @param {Object} fileControlOrId The Id of html control or the html control
		 * @param @param {String} id userId/email of the profile 
		 * @param {Object} [args] The additional parameters
		 */
		updateProfilePhoto: function (fileControlOrId, id, args) {
			var promise = this.validateField("File Control Or Id", fileControlOrId);
			if (promise) {
				return promise;
			}
			promose = this.validateHTML5FileSupport();
			if(promise){
				return promise;
			}			
			
			var idObject = this._toIdObject(id);
			var files = null;
			if (typeof fileControlOrId == "string") {
				var fileControl = document.getElementById(fileControlOrId);
				filePath = fileControl.value;
				files = fileControl.files;
			} else if (typeof fileControlOrId == "object") {
				filePath = fileControlOrId.value;
				files = fileControlOrId.files;
			} else {
				return this.createBadRequestPromise("File Control or ID is required");
			}

			if(files.length != 1){
				return this.createBadRequestPromise("Only one file needs to be provided to this API");
			}
			
			var file = files[0];
			var formData = new FormData();
			formData.append("file", file);
			var requestArgs = lang.mixin(idObject, args || {});		
			var url = this.constructUrl(config.Properties.serviceUrl + "/files/" + this.endpoint.proxyPath + "/" + "connections" + "/" + encodeURIComponent(file.name),
					args && args.parameters ? args.parameters : {});
			var headers = {
				"Content-Type" : false,
				"Process-Data" : false // processData = false is reaquired by jquery 
			};			
			var options = {
				method : "PUT",
				headers : headers,
				query : requestArgs || {},
				data : formData
			};
			var callbacks = {
					createEntity : function(service, data, response) {
						return data; // Since this API does not return any response in case of success, returning empty data
					}
			};

			return this.updateEntity(url, options, callbacks);			
		},
        
        /*
         * Return callbacks for a profile feed
         */
        getProfileFeedCallbacks : function() {
            return ProfileFeedCallbacks;
        },
        
        /*
         * Return callbacks for a ColleagueConnection feed
         */
        getColleagueConnectionFeedCallbacks : function() {
            return ColleagueConnectionFeedCallbacks;
        },

        /*
         * Return callbacks for a profile entry
         */
        getProfileCallbacks : function() {
            return ProfileCallbacks;
        },

        /*
         * Return callbacks for a profile tag feed
         */
        getProfileTagFeedCallbacks : function() {
            return ProfileTagFeedCallbacks;
        },

        /*
         * Convert profile or key to id object
         */
        _toIdObject : function(profileOrId) {
            var idObject = {};
            if (lang.isString(profileOrId)) {
                var userIdOrEmail = profileOrId;
                if (this.isEmail(userIdOrEmail)) {
                    idObject.email = userIdOrEmail;
                } else {
                    idObject.userid = userIdOrEmail;
                }
            } else if (profileOrId instanceof Profile) {
                if (profileOrId.getUserid()) {
                    idObject.userid = profileOrId.getUserid();
                }
                else if (profileOrId.getEmail()) {
                    idObject.email = profileOrId.getEmail();
                }
            }
            return idObject;
        },
        
        /*
         * Convert profile or key to target object
         */
        _toTargetObject : function(profileOrId) {
            var targetObject = {};
            if (lang.isString(profileOrId)) {
                var userIdOrEmail = profileOrId;
                if (this.isEmail(userIdOrEmail)) {
                	targetObject.targetEmail = userIdOrEmail;
                } else {
                	targetObject.targetKey = userIdOrEmail;
                }
            } else if (profileOrId instanceof Profile) {
                if (profileOrId.getUserid()) {
                	targetObject.targetKey = profileOrId.getUserid();
                }
                else if (profileOrId.getEmail()) {
                	targetObject.targetEmail = profileOrId.getEmail();
                }
            }
            return targetObject;
        },
        
        /*
         * Validate an ID object
         */
        _validateIdObject : function(idObject) {
            if (!idObject.userid && !idObject.email) {
                return this.createBadRequestPromise("Invalid argument, userid or email must be specified.");
            }
        },
        
        /*
         * Validate an Target object
         */
        _validateTargetObject : function(idObject) {
            if (!idObject.targetKey && !idObject.targetEmail) {
                return this.createBadRequestPromise("Invalid argument, userid or email must be specified.");
            }
        },
        
        /*
         * Return a Profile instance from Profile or JSON or String. Throws
         * an error if the argument was neither.
         */
        _toProfile : function(profileOrJsonOrString,args) {
            if (profileOrJsonOrString instanceof Profile) {
                return profileOrJsonOrString;
            } else {
            	var profileJson = profileOrJsonOrString;
            	if (lang.isString(profileOrJsonOrString)) {
            		profileJson = {};
            		if(this.isEmail(profileOrJsonOrString)){
            			profileJson.email = profileOrJsonOrString;
            		}else{
            			profileJson.userid = profileOrJsonOrString;
            		}
                }else{ // handle the case when the profileJson has id attribute. id can take either userid or email.
                	if(profileJson && profileJson.id && !profileJson.userid && !profileJson.email){
                		this.isEmail(profileJson.id) ? profileJson.email = profileJson.id : profileJson.userid = profileJson.id;
                		delete profileJson.id;
                	}
                }
                return new Profile({
                    service : this,
                    _fields : lang.mixin({}, profileJson)
                });
            }
        },
        
        /*
         * Returns true if an address field has been set.
         */
        _isAddressSet : function(profile){
        	return (profile._fields["streetAddress"] || profile._fields["extendedAddress"] || profile._fields["locality"] || profile._fields["region"] || profile._fields["postalCode"] || profile._fields["countryName"]);
        },
        
        /*
         * Constructs update profile request body.
         */
        _constructProfilePostData : function(profile) {
            var transformer = function(value,key) {
                if (key == "address") {                	
                	value = profile.service._isAddressSet(profile) ? stringUtil.transform(updateProfileAddressTemplate, {"streetAddress" : profile._fields["streetAddress"], 
                	"extendedAddress" : profile._fields["extendedAddress"], "locality" : profile._fields["locality"], "region" : profile._fields["region"],
                	"postalCode" : profile._fields["postalCode"], "countryName" : profile._fields["countryName"]}) : null;
                } 
                else{                	
                	value = (profile._fields[key])? stringUtil.transform(updateProfileAttributeTemplate, {"attributeName" : consts.ProfileVCardXPath[key], "attributeValue" : profile._fields[key]}) : null;
                	
                }
                return value;
            };
            return stringUtil.transform(updateProfileXmlTemplate, profile, transformer, profile);
        },
        
        /*
         * Constructs update profile request body.
         */
        _constructProfilePutData : function(profile) {
            var transformer = function(value,key) {
            	if(profile._fields[key]){
	                value = stringUtil.transform(createProfileAttributeTemplate, {"attributeName" : consts.profileCreateAttributes[key], "attributeValue" : profile._fields[key]});
	                return value;
            	}
            };
            return stringUtil.transform(createProfileTemplate, profile, transformer, profile);
        },

        /*
         * Validate a Profile object
         */
        _validateProfile : function(profile) {
            if (!profile || (!profile.getUserid() && !profile.getEmail())) {
                return this.createBadRequestPromise("Invalid argument, profile with valid userid or email must be specified.");
            }            
        },
        
        /*
         * Validate a Profile id
         */
        _validateProfileId : function(profileId) {
            if (!profileId || profileId.length == 0) {
                return this.createBadRequestPromise("Invalid argument, expected userid or email");
            }
        },
        
        _getProfileAuthString : function(){
        	if (this.endpoint.authType == consts.AuthTypes.Basic) {
        		return basicAuthString;
        	} else if (this.endpoint.authType == consts.AuthTypes.OAuth) {
        		return OAuthString;
        	} else {
        		return defaultAuthString;
        	}
        }

    });
    return ProfileService;
});
