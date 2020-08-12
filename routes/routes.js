//auth
const register = require('./login/register');
const activationAccount = require('./login/emailActivation');
const repeatActivateAccount = require('./login/repeatEmailActivation');
const signIn = require('./login/signIn');
const refreshToken = require('./login/refreshToken');
const logout = require('./login/logout');
const current = require('./login/current');
const forgotPassword = require('./login/forgotPassword');
const resetPassword = require('./login/resetPassword');
const googleLogin = require('./login/googleLogin');
const facebookLogin = require('./login/facebookLogin');

//Menu
const getAllMenus = require('./menus/getAllMenus');
const addMenu = require('./menus/addMenu');
const getMenuById = require('./menus/getMenuById');
const editMenu = require('./menus/editMenu');
const deleteMenu = require('./menus/deleteMenu');

//MenuItem
const getAllMenuItems = require('./menus/menuItems/getAllMenuItems');
const addMenuItem = require('./menus/menuItems/addMenuItem');
const getMenuItemById = require('./menus/menuItems/getMenuItemById');
const editMenuItem = require('./menus/menuItems/editMenuItem');
const deleteMenuItem = require('./menus/menuItems/deleteMenuItem');

//Content
const addContent = require('./filesUpload/addContent');
const getAllContent = require('./filesUpload/getAllContent');

//File
const getAllIFiles = require('./file/getAllIFiles');
const getFileById = require('./file/getFileById');
const editFileName = require('./file/editFileName');
const deleteFile = require('./file/deleteFile');

//Image
const getAllIImages = require('./image/getAllImages');
const getImageById = require('./image/getImageById');
const deleteImage = require('./image/deleteImage');

//Posts
const getAllPosts = require('./posts/getAllPosts');
const addPost = require('./posts/addPost');
const getPostById = require('./posts/getPostById');
const editPost = require('./posts/editPost');
const deletePost = require('./posts/deletePost');

module.exports = app => {
    //auth
    signIn(app);
    logout(app);
    googleLogin(app);
    facebookLogin(app);
    refreshToken(app);
    current(app);
    register(app);
    activationAccount(app);
    repeatActivateAccount(app);
    forgotPassword(app);
    resetPassword(app);

    //Menu
    getAllMenus(app);
    addMenu(app);
    getMenuById(app);
    editMenu(app);
    deleteMenu(app);

    //MenuItem
    getAllMenuItems(app);
    addMenuItem(app);
    getMenuItemById(app);
    editMenuItem(app);
    deleteMenuItem(app);

    //Content
    addContent(app);
    getAllContent(app);

    //File
    getAllIFiles(app);
    getFileById(app);
    editFileName(app);
    deleteFile(app);

    //Image
    getAllIImages(app);
    getImageById(app);
    deleteImage(app);

    //Posts
    getAllPosts(app);
    addPost(app);
    getPostById(app);
    editPost(app);
    deletePost(app);
};


