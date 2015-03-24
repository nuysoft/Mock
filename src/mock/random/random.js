/* global define */
/*
    ### Mock.Random
    
    工具类，用于生成各种随机数据。
*/
define(
    [
        'mock/util',
        './basic', './date', './image', './color', './text', './name', './web', './address', './helper', './misc'
    ],
    function(
        Util,
        Basic, Date, Image, Color, Text, Name, Web, Address, Helper, Misc

    ) {
        var Random = {
            extend: Util.extend
        }

        Random.extend(Basic)
        Random.extend(Date)
        Random.extend(Image)
        Random.extend(Color)
        Random.extend(Text)
        Random.extend(Name)
        Random.extend(Web)
        Random.extend(Address)
        Random.extend(Helper)
        Random.extend(Misc)
        
        return Random
    }
)