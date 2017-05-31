function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

var groups = ['lost', 'found'];



use laf-dev

db.reports.remove({});

for (var i = 0; i < 100; i++) {

    db.reports.insert({
        "userId": ObjectId("5916c17e8e39aa381be793ce"),
        "date": ISODate("2017-05-20T22:00:00.0Z"),
        "details": "The Sony Xperia S (also known as the Sony Ericsson Xperia NX in Japan) is an Android smartphone from Sony launched at the 2012 Consumer Electronics Show. It is the first Sony-only branded smartphone after Sony acquired Ericsson's stake in Sony Ericsson in January 2012. The Xperia S has a 4.3 in (110 mm) touch-screen with the mobile BRAVIA engine which optimizes the picture, a 1.5 GHz dual core processor, a 12.0-megapixel rear camera, HDMI-out, 1 GB of RAM, and 32 GB of internal storage.",
        "group": groups[Math.floor(Math.random() * 2)],
        "category1": "electronics",
        "category2": "smartphone",
        "title": "Subject " + (i + 1),
        "serialNo": "234-234-234-234-23",
        "description": "The Sony Xperia S (also known as the Sony Ericsson Xperia NX in Japan) is an Android smartphone from Sony launched at the 2012 Consumer Electronics Show. It is the first Sony-only branded smartphone after Sony acquired Ericsson's stake in Sony Ericsson in January 2012. The Xperia S has a 4.3 in (110 mm) touch-screen with the mobile BRAVIA engine which optimizes the picture, a 1.5 GHz dual core processor, a 12.0-megapixel rear camera, HDMI-out, 1 GB of RAM, and 32 GB of internal storage.",
        "comments": [],
        "avatarFileName": "",
        "photos": [],
        "geolocation": {
            "lat": getRandomInRange(-180, 180, 3),
            "lng": getRandomInRange(-180, 180, 3)
        }
    });
}