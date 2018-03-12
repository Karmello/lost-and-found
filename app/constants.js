angular.module('appModule').constant('URLS', {
  itemImg: 'public/imgs/item.png',
  AWS3_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploads/',
  AWS3_RESIZED_UPLOADS_BUCKET_URL: 'https://s3.amazonaws.com/laf.useruploadsresized/'
});

angular.module('appModule').constant('NUMS', {
  photoMaxSize: 1048576
});