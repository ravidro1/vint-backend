const Analytics = require("../models/Analytics");
const Products = require("../models/Product");
const User = require("../models/User");



function GetUnseen(userId) {
    return Analytics.findOne({ userId: userId }).then((analytics) => {
        if (analytics) {
            return analytics?.unseen;
        }
    });
}

function sortAndRemoveDuplicates(arr){
    let clone = []
    for (let i = 0; i < arr.length; i++) {
        if (clone.length > 0){
            let check = false
            clone.map((element)=>{
                if (arr[i] === element.value) {
                   element.count++
                    check = true
                }
            })
            if (!check) {
                clone.push({ value: arr[i], count: 1 })
            }

        }
    }
    return clone.sort((a,b)=> a.count - b.count)
}

function GetSeen(userId) {
    return Analytics.findOne({ userId: userId }).then((analytics) => {
        if (analytics) {
            return analytics?.seen;
        }
    });
}
function AddSeen(userId, seen) {
    const divider = 3;
    Analytics.findOne({ userId: userId }).then((analytics) => {
        if (analytics) {
            const seenLength = analytics?.seen.length;
            const unseenLength = analytics?.unseen.length;
            try {
                analytics?.seen.unshift(seen);
                analytics?.markModified("seen");
                analytics?.save();
                if (seenLength >= unseenLength / divider) {
                    const oldest_seen = analytics?.seen.slice(-(seenLength / divider));
                    analytics?.unseen.push(oldest_seen);
                    analytics.seen = analytics?.seen.slice(
                        seenLength - seenLength / divider
                    );

                    analytics?.markModified("unseen");
                    analytics?.markModified("seen");
                    analytics?.save();
                }
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }
    });
}

function GetProductTags(productId){
    return Products.findOne({ _id: productId }).then((product) => {
        if (product) {
            return product?.tags;
        }
    });
}
function CalcSummary(userId, clicks, observers, liked) {
    let likedtags = []
    const likesToClicks = liked.map((likedProduct) => {
        likedtags.push(...GetProductTags(likedProduct))
    });

    const toClicks = observers.map((observer) => {
        return (observer.score = observer.score / 10);
    });
    const sum = clicks.map((click) => {
        let check = false;
        toClicks.map((toClick) => {
            if (toClick.tag === click.tag) {
                click.score += toClick.score;
                check = true;
            }
        });
        likedtags.map((likeToClick) => {
            if (likeToClick === click.tag) {
                //for each like click add 10 scores
                click.score += 10;
                check = true;
            }
            if (!sum.tag.includes(likeToClick)) {
                sum.push({tag:likeToClick, score:10});
            }
        })
        if (!check) {
            toClicks.map((toClick) => {
                check = false;
                clicks.map((click) => {
                    if (toClick.tag === click.tag) {
                        check = true;
                    }
                });
                if (!check) {
                    sum.push(toClick);
                }
            });
        }

    });
    Analytics.findOne({ userId: userId }).then((analytics) => {
        analytics.sum = sum;

        analytics?.sum?.sort(GetScore);
        Analytics?.save();
    });
}
function GetTag(tag) {
    return tag.tag;
}
function GetScore(tag) {
    return tag.score;
}
function GetProductFromProductarray(productArr){
    let products = []
    productArr.map((product) => {
        products.push(product.id);
    });
    return products;
}
function SortByTags(userId, products) {
    const Answer = [];
    Analytics.findOne({ userId: userId }).then((analytics) => {
        products.map((product) => {
            let matchRank = 0;
            analytics?.sum.map((tag) => {
                if (product.tags?.includes(GetTag(tag))) {
                    matchRank++;
                }
            });
            Answer.push({ product, score: matchRank });
        });
        // Answer.sort(GetScore);
        analytics.unseen = Answer.sort(GetScore);
        analytics?.save();
    });
    return Answer.sort(GetScore);
}

function GetRandomizedProducts(userId) {
    return User.findOne({ userId: userId }).then((user) => {
        if (user) {
            return user?.fastLoadProducts;
        }
    });
}

module.exports = {
    GetFeed: async (req, res) => {
        try {
            const { userId } = req.body;
            let response;
            User.findOne({ userId: userId }).then((user) => {
                if (user?.loginCounter <= 1) {
                    response = user?.fastLoadProducts;
                }
            });
            if (response) {
                Analytics.findOne({ userId: userId }).then((analytics) => {
                    response = analytics?.unseen;
                });
            }
            res.json(response);
            // now just sort!
            // if (first time) return randomized
            // else return getunseen
            // after res=> softbyarray and save!
            //
            const products = GetUnseen(userId);
            let Answer = SortByTags(userId, products);
            Products.find().then((products) => {
                const filteredProducts = products.filter((product) => {
                    return GetSeen(userId).filter((seen) => {
                        return seen.productId !== product._id;
                    });
                });
                Analytics.findOne({ userId: userId }).then((analytics) => {
                    analytics.unseen = filteredProducts;
                    analytics?.save();
                });
            });
        } catch (e) {
            console.log(e);
        }
    },
    AddAnalytics: async (req, res) => {
        const { userId, productsArr, seen } = req.body;
        Analytics.findOne({ userId: userId }).then((userAnalytics) => {
            Products.find({'_id': {$in: [productsArr.productId]}}).then((products) => {
                products.map((product) => {
                    let tags = product.tags;
                    if (product.liked) {
                        userAnalytics?.liked.push(product.productId);
                        userAnalytics?.save().then(() => {
                            CalcSummary(userId, userAnalytics?.clicks, userAnalytics?.observer, userAnalytics?.liked);
                        });
                    }
                    if (product.click) {
                        tags?.map((tag) => {
                            let check = false;
                            userAnalytics?.clicks.map((exist_tag) => {
                                if (tag === exist_tag.tag) {
                                    check = true;
                                    exist_tag.score += 1;
                                }
                            });
                            if (check) {
                                userAnalytics?.clicks.push({ tag: tag, score: 1 });
                            }
                        });
                        userAnalytics?.save().then(() => {
                            CalcSummary(userId, userAnalytics?.clicks, userAnalytics?.observer, userAnalytics?.liked);
                        });
                    }
                    if (product.observer > 0) {
                        tags.map((tag) => {
                            let check = false;
                            userAnalytics?.observer.map((exist_tag) => {
                                if (tag === exist_tag.tag) {
                                    check = true;
                                    exist_tag.score += 1;
                                }
                            });
                            if (check) {
                                userAnalytics?.observer.push({ tag: tag, score: 1 });
                            }
                        });
                        userAnalytics?.save().then(() => {
                            CalcSummary(userId, userAnalytics?.clicks, userAnalytics?.observer, userAnalytics?.liked);
                        });
                    }
                })
            });
            try {
                AddSeen(userId, GetProductFromProductarray(productsArr));
            } catch (e) {
                console.log(e);
            }
        })
    },
    Search: async (req, res) => {
        try {
            const { userId, input } = req.body;
            const Answer = [];
            let highMatchProducts;
            let lowMatchProducts;
            Products.find().then((products) => {
                //filter high match products:
                highMatchProducts = products.filter((product) => {
                    return (
                        product.name.toLowerCase().includes(input.toLowerCase()) ||
                        product.category.toLowerCase().includes(input.toLowerCase())
                    );
                });
                Answer.push(SortByTags(userId, highMatchProducts));
                //filter low match products:
                lowMatchProducts = products.filter((product) => {
                    return product.tags.filter((tag) => {
                        return input.toLowerCase().includes(tag.toLowerCase());
                    });
                });
                Answer.push(...SortByTags(userId, lowMatchProducts));
                res.json(Answer);
            });
        } catch (e) {
            console.log(e);
        }
    },
    GetFollowingFeed: async (req, res) => {
        const { userId } = req.body;
        const productsArr = [];
        let answer;
        User.findOne({ _id: userId }).then((user) => {
            User.find({ _id: { $in: user?.following } }).then((followingSellers) => {
                followingSellers.map((seller) => {
                    Products.find({ _id: { $in: seller?.products } }).then((products) => {
                        productsArr.push(SortByTags(seller._id, products));
                    });
                });
            });
        });
        answer = SortByTags(userId, productsArr);
        res.json(answer);
    },
    MyTown: async (req, res) => {
        const { town } = req.body;
        let allLiked = []
        let clone = []
        User.find({location: town}).then((users) => {
            Analytics.find({userId: {$in: users.map((user) => user._id)}}).then((allCurrectUsers)=>{
                allCurrectUsers.map((user) => {
                    allLiked.push(user.liked);
                })
                // insert times repeated function
                res.json(sortAndRemoveDuplicates(allLiked));
            })
        })

    }
};
