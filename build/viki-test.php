<?php

use NGSOFT\{
    Curl\CurlRequest, Tools\Objects\stdObject
};

require 'build.php';

/*
  def SIGN(url,pth):
  #timestamp = str(int(time.time()))
  #key = '-$iJ}@p7!G@SyU/je1bEyWg}upLu-6V6-Lg9VD(]siH,r.,m-r|ulZ,U4LC/SeR)'
  #rawtxt = '/v4/videos/'+url+pth+'?app=65535a&t='+timestamp+'&site=www.viki.com'
  #hashed = hmac.new(key, rawtxt, sha1)
  #fullurl = 'https://api.viki.io' + rawtxt+'&sig='+binascii.hexlify(hashed.digest())
  #return fullurl

  timestamp = str(int(time.time()))
  key = 'MM_d*yP@`&1@]@!AVrXf_o-HVEnoTnm$O-ti4[G~$JDI/Dc-&piU&z&5.;:}95=Iad'
  rawtxt = '/v4/videos/'+url+pth+'?app=100005a&t='+timestamp+'&site=www.viki.com'
  hashed = hmac.new(key, rawtxt, sha1)
  fullurl = 'https://api.viki.io' + rawtxt+'&sig='+binascii.hexlify(hashed.digest())
  return fullurl
 */

function sign($url, $pth) {

    $tt = time();
    $key1 = '-$iJ}@p7!G@SyU/je1bEyWg}upLu-6V6-Lg9VD(]siH,r.,m-r|ulZ,U4LC/SeR)';
    $key = 'MM_d*yP@`&1@]@!AVrXf_o-HVEnoTnm$O-ti4[G~$JDI/Dc-&piU&z&5.;:}95=Iad';
    $app = [
        'id' => '100005a',
        'version' => '4.0.57',
    ];

    $rawtxt = sprintf('/v4/videos/%s%s?app=%s&t=%d&site=www.viki.com', $url, $pth, $app['id'], $tt);

    $hashed = hash_hmac('sha1', $rawtxt, $key);
    return sprintf('https://api.viki.io%s&sig=%s', $rawtxt, $hashed);
}

function fetch(string $id, string $useragent = 'Mozilla/5.0 (Macintosh; MacOS X10_14_3; rv;67.0) Gecko/20100101 Firefox/67.0') {
    $url = sign($id, '/streams.json');



    $c = CurlRequest::create()->withUserAgent($useragent);
    $response = $c->fetch($url);
    var_dump([$url, $useragent, $response->status]);
    return $response->status === 200 ? stdObject::fromJson($response->contents) : stdObject::from(['status' => $response->status]);
}

$test = stdObject::from([
            'videos' => [
                '1172605v',
                '1174973v'
            ],
            "useragents" => [
                "iphone 4" => 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7',
                'iphone 6' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
                'iphone 6 safari' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_2 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A551 Safari/8536.25 GDApple/0.0.0 QuantcastSDK/iOS_1.5.3/1a33em6z8w476mog-ugyz0qbpkepdnehu',
                'android 4' => 'Mozilla/5.0 (Linux; U; Android 4.4; es-us; ) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.4 Mobile Safari/534.30',
                'iPhone' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/ 604.1.21 (KHTML, like Gecko) Version/ 12.0 Mobile/17A6278a Safari/602.1.26',
                'OSX Mojave' => 'Mozilla/5.0 (Macintosh; MacOS X10_14_3; rv;67.0) Gecko/20100101 Firefox/67.0',
                'Huawei P9 Lite' => 'Mozilla/5.0 (Linux; Android 7.0; HUAWEI VNS-L31) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.101 Mobile Safari/537.36',
                'Huawei P30 Pro' => 'Mozilla/5.0 (Linux; Android 9; VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.90 Mobile Safari/537.36',
                'Last Gen' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
            ],
            "useragents2" => [
            ]
        ])->disableDotArrayConvertion();

function getVideoInfos(string $id, string $ua = CurlRequest::USER_AGENT) {
    if (preg_match('/^\d+v$/', $id)) {
        $c = CurlRequest::create()
                ->withUserAgent($ua)
                ->withHeaders([
            'x-viki-app-ver' => '4.0.57',
            'x-client-user-agent' => $ua
        ]);
        // ->withReferer(sprintf('https://www.viki.com/videos/%s', $id));


        $response = $c->fetch(sprintf('https://www.viki.com/api/videos/%s', $id));
        if ($response->status === 200) return stdObject::fromJson($response->contents);
        return stdObject::create(['status' => $response->status]);
    }
}

CurlRequest::setCertlocation(__DIR__ . '/cache');




//$url = sign($test->videos[1], '/streams.json');
//$response = $c->fetch($url);
//print_r($response->status);
//$json = stdObject::fromJson($response->contents);
//print_r($json);





print_r($responses = $test->useragents->map(function($v)use($test) {
    return fetch($test->videos[0], $v);
    // $result = getVideoInfos($test->videos[1], $v);
    //return ['streams' => $result->streams, 'drm' => $result->drm];
}));
exit;

print_r($vi = $test->useragents->map(function($v)use($test) {

    $r = getVideoInfos($test->videos[1], $v);

    if ($r->count() > 0) {

        echo "$v success\n";
    }

    return [$r->drm, $r->streams];
}));


