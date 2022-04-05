const chefList = [
	// real chefs
	{
		"comments_given": 2,
		"comments_received": 2,
		"country": "United Kingdom",
		"created_at": "2020-11-04T21:04:13.215Z",
		"followers": 1,
		"id": 9,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/450dee43aff9070dda29dd750d8172f445ee2720.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=OyZAZs1N1UgCOfqbQDnRISQ4nYqKbWRbeproTpa2blepYfDwAunfSn5uo3VawmnHVRx6kracsorVpgp6HHMpisAIbbJM2mdusAexYQRkiIEe3w5JPohN7xX%2F99H1luX%2B%2FNLdQ78VBwkhiCmjgGJJ%2F4Ei79NxQwx4QQgoax4F3U1xCBPANOYqPXsFx5q0kQHZA1bxryxjmc6uodKIwYQY47hv%2FRaa%2BYyurvk7ieCu07K7iKAqOXjnoctoPLbJ2lyRhsR33rmi%2BjOEo8qwdAnqBw%2BuAKzLF%2F1kESI5vDgbvnqxaX2aj5xry6MO97mNXyYioOQ0ylHRx248VOJFFKja1g%3D%3D",
		"profile_text": "",
		"recipe_count": 3,
		"recipe_likes_given": 0,
		"recipe_likes_received": 2,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "Jon H",
	},
	{
		"comments_given": 0,
		"comments_received": 0,
		"country": "United Kingdom",
		"created_at": "2020-10-09T16:42:52.797Z",
		"followers": 4,
		"id": 8,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/441e912e716ab8b1f56bdfd6bf2c5437183b58d7.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=ODCJliZIcO1xFv3MM1o7mTBW3Tfqu87eVIRRJ9f%2BlPOdLrMPnSd9bdhLsQgLcdWxcXhHO5iQvssdklRE2CVXh2yuJI9cNXZC1%2FDPf9ken9uMi8JIN7zYMpYPx6XKmeID%2FliKX80yYyBYxuTrLF9jDL2iB0%2Fz7mfnOQchuDEAIf%2BWYscMebb7lqhfAL03whn4Xxm%2F1RAu0XDfydqqjKvHjyKrffG3%2BVZAueaF8lgUCuhlInOpq1ZeH4POMBzf%2FUHzFFWiLW74%2F9xpGeEldg%2FlQ18n3%2BD04BjhSl7kkCwvFnRmCzq%2BzsPxFMMpZfoskG8q4Zvl5VhClo%2BX7Z3%2Bic2vKA%3D%3D",
		"profile_text": "Auntie",
		"recipe_count": 0,
		"recipe_likes_given": 0,
		"recipe_likes_received": 0,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "jill",
	},
	{
		"comments_given": 0,
		"comments_received": 1,
		"country": "United Kingdom",
		"created_at": "2020-10-09T16:41:45.502Z",
		"followers": 3,
		"id": 7,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/6248387f13cb410cace9326281ddbdf933c20caf.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=s4%2Fv9S5yuZnh0WjJHgsrPemfjHOCudd%2FYuoH9T78%2FwbZe6q2BCcBj2yIfJll6Uym%2BvQpbIwxCTG0pzVVacuyyS90N%2FlsjjXql61w4c4faeQ0BIpNtsf2jEDM6g%2BZkP1DyL578%2BdMT2XMGGxbSqMef7kfLkjBLMioBty%2FWO9FStR%2Bho4EJKFhbwXcBZlvmMXwFO23mpA40%2BIDvS%2Baf17IAtGzIlsAj3FQzyWcmyngx10pAfKG4bab80lZkiyA7V%2B2RYQvuC%2BS5%2BhfSf%2BGg88WSQUHZMKDzzfINic%2FA%2FhuTEvv55IOB2OGOdMaNZ%2F7Yjj5fr%2BgcJxV2iEurcC41FnbVQ%3D%3D",
		"profile_text": "",
		"recipe_count": 2,
		"recipe_likes_given": 1,
		"recipe_likes_received": 4,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "Jane",
	},
	{
		"comments_given": 0,
		"comments_received": 0,
		"country": "United States",
		"created_at": "2020-10-09T16:36:53.689Z",
		"followers": 1,
		"id": 6,
		"image_url": "",
		"profile_text": "Not the best cook",
		"recipe_count": 0,
		"recipe_likes_given": 0,
		"recipe_likes_received": 0,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "moranja",
	},
	{
		"comments_given": 0,
		"comments_received": 0,
		"country": "United Kingdom",
		"created_at": "2020-10-09T16:32:13.490Z",
		"followers": 3,
		"id": 5,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/518a9c903412b97d5dd8e776c2043e65326b732c.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=CPG3PyQRldMffr5pz57nyaBlouibwk2yWzL%2BAqXsBFrqOhiVu1V5IgFoT6c51F6PA5fSMrF1dwqKKMoP%2FF8%2B8ct5x12EL3j2jNW7U0cCG3NLkYPtg9VOI1loYUIBTGmcR9KOSs8CiJ%2FEA8K0knJ2O95azfwrIJHYdh981qLUn5Xqg25pP8L1e7DxASGlxOtZ1KmPVvzDIkjprbvMW4fd%2BNvGdjhpje8MzJQEFQm6wSdRMJsnHJRlqPqHpGlAfFKhaTFZH3a4bSBcVjdDuD%2FXkmd14SkU8lbm9Wun0KfQ15HB6u8kGFrDDIQYcYXVVDY1Q8i%2BKmi48Rh9g7%2BZNDN1PA%3D%3D",
		"profile_text": "",
		"recipe_count": 0,
		"recipe_likes_given": 0,
		"recipe_likes_received": 0,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "rachael.lamb",
	},
	{
		"comments_given": 0,
		"comments_received": 2,
		"country": "United Kingdom",
		"created_at": "2020-10-08T17:06:21.580Z",
		"followers": 3,
		"id": 4,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/c54ffc9ad8c87260a9f63e33328e6c2d75ccadd2.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=fbAuF0w8R79tRNshvOzULNtcO1nqiON2DvHIWrgyXFFI3WFW271RX%2B78vf6KSxUmL60RSmqEljqH4D%2BSDYlnxqqxcY%2Bv37srdyXPzkWSOnGaHpBvOyqUTEFHAE7I21Esl%2ByMVZpTxmiL044sj%2FbWZaPj1RjNeMvODff2fUTePH0QfwBTl7I7n8XSYIDNrR8uIfXNaTgtd03v2cMumO052FR0TcFFYu5wNHim5uGE4bJrnCw%2Bge8NUuIelCIGtQPyatBKi2twTceWY%2F%2BP9%2BG%2B5Y%2B1ceAkO4euR5z9szVlxUxrinIkKoQZQqL%2BkpmVa4UuO9niMYpPmtcho7UZ3%2FHItw%3D%3D",
		"profile_text": "Mum",
		"recipe_count": 11,
		"recipe_likes_given": 1,
		"recipe_likes_received": 2,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "felicity",
	},
	{
		"comments_given": 0,
		"comments_received": 0,
		"country": "United States",
		"created_at": "2020-10-08T02:55:49.278Z",
		"followers": 4,
		"id": 3,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/0b8e87abd37d1f2555be35f114072995293e8b06-20210519_192936.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=UjBqAPruliKRvDCjXU04tggxq8NwuWCjk7dZyrNQw9of8RPfyvDLefhy11EC593vtwMVivnxiBq39ZdWhUIKBEzyK9iH3k0UZeqXwTlp92Sp4a6gI9WxKTTC9A%2BFlF4sTOFyngVbYFIhVjAz30tuZqOyMmXqA8jFaokY%2BOqRJ8DpYg00og3fP1zKCH5PmgI4RsF0fTtwOzc8a%2B2w1r3HhXrUAaNQPF7aO7lI67ri%2B7vHxK0UpgENwfQ%2BgX59PijueoSLc0IVqhv49VE%2BF08EdxeStKxkEhyDqcQLpufJkRGI%2BIcI7%2BxrhW4ZVa4yJs%2BBZONF31cZSnu62PWNxS0Y3Q%3D%3D",
		"profile_text": "I love to try new recipes!",
		"recipe_count": 10,
		"recipe_likes_given": 4,
		"recipe_likes_received": 4,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "pothers2",
	},
	{
		"comments_given": 1,
		"comments_received": 0,
		"country": "United States",
		"created_at": "2020-09-26T02:39:25.936Z",
		"followers": 2,
		"id": 2,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/d4b86a5fa932ddd8c445df784d1f3059a4c93f11.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=ZLQBNGm8%2B5Gw8JKi3yZYzZZBFw531%2BU3QySTtEDjPpblQefKQ2rN0kcczR%2BGDL0leWCH0KJW5UTF9EIPN7dbLMX5MOSw%2Bod%2FPkksNDOgvMeuFsxATftdRthhjzB2p1KxmHCDERgMyE%2F%2FazJiVPJQTgbLjcnSOf%2B80PcY24Ez%2B7Qqwxs4ec8bMwBmT0hNHzeHPUPoDWOCT2tg0sVBvjWpXdpbQJSyit0R9Hnui%2F2suZoK8UUwa%2FbQflwIErvEn553sNdJuq2%2F4DCtW2MxJ%2FUaPlC38F9kTaUpdZOhdLH%2F8OcPzPFH%2B4tVaxZ5hYf5OK3CRj4EVdc08LxMVdo90RzwsA%3D%3D",
		"profile_text": "I love to bake bread and cook food. ",
		"recipe_count": 0,
		"recipe_likes_given": 2,
		"recipe_likes_received": 0,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "notorious mrp",
	},
	{
		"comments_given": 5,
		"comments_received": 1,
		"country": "United States",
		"created_at": "2020-09-18T01:43:10.853Z",
		"followers": 5,
		"id": 1,
		"image_url": "https://storage.googleapis.com/chef-avatars-ac1cff8d11c908f3cf8613121b61683221152250/139409814d7b033cc8bce85bebfda9ccfceaa84b.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651363200&Signature=fY5v1N63jdUmF4x%2F78Y6%2FxxAm1Y9%2FoSs68j6r5O%2FhvlpO441fi7vOxGhlPjpbQMfa7qYjwa8ynjXgzR%2BVSFpt2VRw7GekwBfsKaraYXVn7SYoKvOK2mLf8%2FvyzONp0YCdEZV2KBCkwe2QNt6jNY4QnrWd84j6dFDJJqE4M91Km5%2F8dURebqHSc58M1Luw4QGLegWnLUtwR1xUymAyhn8A0IF%2BGwZX1oyj2cznmQbooxPnysX6o6zp8TXMXhdA4%2FUyUyjox9FCUDI7qm%2FSVYxjwjAmx%2B1iqXysE5ltIFxnBvpuKQwKG1wBt9JRS7J2f4mct%2FMowdls3rHju8Km9XkuA%3D%3D",
		"profile_text": "I love to bake bread, and cook simple home cooked food as deliciously as possible.",
		"recipe_count": 67,
		"recipe_likes_given": 9,
		"recipe_likes_received": 6,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "Pothers",
	},
	// faker chefs
	{
		"comments_given": 0,
		"comments_received": 0,
		"country": "United Kingdom",
		"created_at": "2021-09-13T20:30:01.414Z",
		"followers": 2,
		"id": 36,
		"image_url": "https://storage.googleapis.com/chef-avatars-60b23e960161/5feaed88a54f4a2f907236a9311679a947d6d3ac-20210916_094609.jpg?GoogleAccessId=recipe-share-image-handler%40recipe-share-272202.iam.gserviceaccount.com&Expires=1651381200&Signature=mXUrUIbauXivxr3RJRl8QwlT2wIn%2BS07dREnwCNw5VyFWCs6SBsTjH9bsWKyWmPjy8Gv5QD3sezojd%2Bcq0nhTKRTMnk6lIw%2FbLieEMHE2rR6tKeolkLcsNV5cuISQklVFw5kBOMR%2FKWoxS%2FDviT%2FWWK%2FASaXnx5r2QBakcMWPeVA4y4vPtJ525goA9rf9ix0zhNKTjAK3CMN3%2F%2BrT2OP8WijgFEY4POdw2%2BykpB49BB3WTpRA4LnbhVxEqFvZQo5HtcDfdkvW6%2BiQ8hFzMgCuvFzrN2T4br1Qc0Hrwy39CX9fKj1ZMS5GsV4evJJqIF0o7o7LEk%2FrLs%2FsLZXq8gN9A%3D%3D",
		"profile_text": "I like cooking and coding",
		"recipe_count": 1,
		"recipe_likes_given": 0,
		"recipe_likes_received": 0,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "Mark",
	},
	{
		"comments_given": 6,
		"comments_received": 4,
		"country": "United Kingdom",
		"created_at": "2020-11-16T22:50:15.986Z",
		"followers": 3,
		"id": 13,
		"image_url": "",
		"profile_text": "I like cooking lots. ",
		"recipe_count": 9,
		"recipe_likes_given": 2,
		"recipe_likes_received": 3,
		"recipe_makes_given": 0,
		"recipe_makes_received": 0,
		"user_chef_following": 1,
		"username": "Pothers",
	},
	{
		"comments_given": 46,
		"comments_received": 41,
		"country": "Alpha Quadrant",
		"created_at": "2020-10-02T19:07:32.763Z",
		"followers": 23,
		"id": 11,
		"image_url": "https://robohash.org/utautnemo.png?size=300x300&set=set1",
		"profile_text": "It's not what happens to you, but how you react to it that matters.",
		"recipe_count": 25,
		"recipe_likes_given": 72,
		"recipe_likes_received": 71,
		"recipe_makes_given": 38,
		"recipe_makes_received": 39,
		"user_chef_following": 1,
		"username": "I have a very long username for ui testing purposes",
	},
	{
		"comments_given": 44,
		"comments_received": 37,
		"country": "Khitomer",
		"created_at": "2020-10-02T19:07:32.004Z",
		"followers": 25,
		"id": 10,
		"image_url": "https://robohash.org/voluptatemestqui.png?size=300x300&set=set1",
		"profile_text": "Control thy passions lest they take vengence on thee.",
		"recipe_count": 21,
		"recipe_likes_given": 63,
		"recipe_likes_received": 71,
		"recipe_makes_given": 50,
		"recipe_makes_received": 34,
		"user_chef_following": 1,
		"username": "Idir",
	},
	{
		"comments_given": 49,
		"comments_received": 67,
		"country": "Badlands",
		"created_at": "2020-10-02T19:07:29.707Z",
		"followers": 28,
		"id": 9,
		"image_url": "https://robohash.org/autquiaut.png?size=300x300&set=set1",
		"profile_text": "Control thy passions lest they take vengence on thee.",
		"recipe_count": 31,
		"recipe_likes_given": 67,
		"recipe_likes_received": 103,
		"recipe_makes_given": 42,
		"recipe_makes_received": 64,
		"user_chef_following": 0,
		"username": "Xinth",
	},
	{
		"comments_given": 53,
		"comments_received": 50,
		"country": "Deep Space Nine",
		"created_at": "2020-10-02T19:07:26.046Z",
		"followers": 30,
		"id": 8,
		"image_url": "https://robohash.org/sedsuntsit.png?size=300x300&set=set1",
		"profile_text": "The mind is not a vessel to be filled but a fire to be kindled.",
		"recipe_count": 24,
		"recipe_likes_given": 73,
		"recipe_likes_received": 82,
		"recipe_makes_given": 48,
		"recipe_makes_received": 43,
		"user_chef_following": 0,
		"username": "Narisca",
	},
	{
		"comments_given": 51,
		"comments_received": 46,
		"country": "Risa",
		"created_at": "2020-10-02T19:07:23.057Z",
		"followers": 35,
		"id": 7,
		"image_url": "https://robohash.org/erroruteos.png?size=300x300&set=set1",
		"profile_text": "Love is composed of a single soul inhabiting two bodies.",
		"recipe_count": 22,
		"recipe_likes_given": 78,
		"recipe_likes_received": 78,
		"recipe_makes_given": 52,
		"recipe_makes_received": 53,
		"user_chef_following": 0,
		"username": "Nauptria",
	},
	{
		"comments_given": 41,
		"comments_received": 29,
		"country": "Risa",
		"created_at": "2020-10-02T19:07:21.562Z",
		"followers": 19,
		"id": 6,
		"image_url": "https://robohash.org/etullamrerum.png?size=300x300&set=set1",
		"profile_text": "Most people would rather give than get affection.",
		"recipe_count": 15,
		"recipe_likes_given": 74,
		"recipe_likes_received": 46,
		"recipe_makes_given": 43,
		"recipe_makes_received": 31,
		"user_chef_following": 0,
		"username": "Issorile",
	},
	{
		"comments_given": 46,
		"comments_received": 61,
		"country": "Delta Quadrant",
		"created_at": "2020-10-02T19:07:20.796Z",
		"followers": 24,
		"id": 5,
		"image_url": "https://robohash.org/quiamollitianon.png?size=300x300&set=set1",
		"profile_text": "Good habits formed at youth make all the difference.",
		"recipe_count": 29,
		"recipe_likes_given": 72,
		"recipe_likes_received": 72,
		"recipe_makes_given": 58,
		"recipe_makes_received": 68,
		"user_chef_following": 0,
		"username": "Bulthmaas",
	},
	{
		"comments_given": 44,
		"comments_received": 29,
		"country": "Ferenginar",
		"created_at": "2020-10-02T19:07:19.293Z",
		"followers": 22,
		"id": 4,
		"image_url": "https://robohash.org/estperferendiseum.png?size=300x300&set=set1",
		"profile_text": "The unexamined life is not worth living.",
		"recipe_count": 14,
		"recipe_likes_given": 78,
		"recipe_likes_received": 45,
		"recipe_makes_given": 32,
		"recipe_makes_received": 26,
		"user_chef_following": 0,
		"username": "Zunzil Ligature",
	},
]

module.exports = { chefList }
