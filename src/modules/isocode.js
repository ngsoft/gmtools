/**
 * ISO Language Codes (639-1 and 693-2) and IETF Language Types
 * language-codes-3b2
 * @link https://datahub.io/core/language-codes
 * @link https://cdn.jsdelivr.net/gh/ngsoft/userscripts@master/dist/gmutils.min.js
 */
(function(root, factory){
    /* globals define, require, module, self */
    const
            name = "isocode",
            dependencies = [];
    if (typeof define === 'function' && define.amd) {
        define(name, dependencies, factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory(...dependencies.map(dep => require(dep)));
    } else {
        root.require = root.require || function(dep){
            let result;
            Object.keys(Object.getOwnPropertyDescriptors(root)).some(key => {
                if (key.toLowerCase() === dep.toLowerCase()) result = root[key];
                return typeof result !== "undefined";
            });
            return result;
        };
        root[name] = factory(...dependencies.map(dep => require(dep)));/*jshint ignore:line */
    }
}(typeof self !== 'undefined' ? self : this, function nr6ikuukvab60q3tx3kr49(){


    const
            s = "string",
            data = [
                {"English": "Serbo-Croatian", "alpha2": "sh", "alpha3-b": "hbs"},
                {"English": "Afar", "alpha2": "aa", "alpha3-b": "aar"},
                {"English": "Abkhazian", "alpha2": "ab", "alpha3-b": "abk"},
                {"English": "Afrikaans", "alpha2": "af", "alpha3-b": "afr"},
                {"English": "Akan", "alpha2": "ak", "alpha3-b": "aka"},
                {"English": "Albanian", "alpha2": "sq", "alpha3-b": "alb"},
                {"English": "Amharic", "alpha2": "am", "alpha3-b": "amh"},
                {"English": "Arabic", "alpha2": "ar", "alpha3-b": "ara"},
                {"English": "Aragonese", "alpha2": "an", "alpha3-b": "arg"},
                {"English": "Armenian", "alpha2": "hy", "alpha3-b": "arm"},
                {"English": "Assamese", "alpha2": "as", "alpha3-b": "asm"},
                {"English": "Avaric", "alpha2": "av", "alpha3-b": "ava"},
                {"English": "Avestan", "alpha2": "ae", "alpha3-b": "ave"},
                {"English": "Aymara", "alpha2": "ay", "alpha3-b": "aym"},
                {"English": "Azerbaijani", "alpha2": "az", "alpha3-b": "aze"},
                {"English": "Bashkir", "alpha2": "ba", "alpha3-b": "bak"},
                {"English": "Bambara", "alpha2": "bm", "alpha3-b": "bam"},
                {"English": "Basque", "alpha2": "eu", "alpha3-b": "baq"},
                {"English": "Belarusian", "alpha2": "be", "alpha3-b": "bel"},
                {"English": "Bengali", "alpha2": "bn", "alpha3-b": "ben"},
                {"English": "Bihari languages", "alpha2": "bh", "alpha3-b": "bih"},
                {"English": "Bislama", "alpha2": "bi", "alpha3-b": "bis"},
                {"English": "Bosnian", "alpha2": "bs", "alpha3-b": "bos"},
                {"English": "Breton", "alpha2": "br", "alpha3-b": "bre"},
                {"English": "Bulgarian", "alpha2": "bg", "alpha3-b": "bul"},
                {"English": "Burmese", "alpha2": "my", "alpha3-b": "bur"},
                {"English": "Catalan; Valencian", "alpha2": "ca", "alpha3-b": "cat"},
                {"English": "Chamorro", "alpha2": "ch", "alpha3-b": "cha"},
                {"English": "Chechen", "alpha2": "ce", "alpha3-b": "che"},
                {"English": "Chinese", "alpha2": "zh", "alpha3-b": "chi"},
                {"English": "Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic", "alpha2": "cu", "alpha3-b": "chu"},
                {"English": "Chuvash", "alpha2": "cv", "alpha3-b": "chv"},
                {"English": "Cornish", "alpha2": "kw", "alpha3-b": "cor"},
                {"English": "Corsican", "alpha2": "co", "alpha3-b": "cos"},
                {"English": "Cree", "alpha2": "cr", "alpha3-b": "cre"},
                {"English": "Czech", "alpha2": "cs", "alpha3-b": "cze"},
                {"English": "Danish", "alpha2": "da", "alpha3-b": "dan"},
                {"English": "Divehi; Dhivehi; Maldivian", "alpha2": "dv", "alpha3-b": "div"},
                {"English": "Dutch; Flemish", "alpha2": "nl", "alpha3-b": "dut"},
                {"English": "Dzongkha", "alpha2": "dz", "alpha3-b": "dzo"},
                {"English": "English", "alpha2": "en", "alpha3-b": "eng"},
                {"English": "Esperanto", "alpha2": "eo", "alpha3-b": "epo"},
                {"English": "Estonian", "alpha2": "et", "alpha3-b": "est"},
                {"English": "Ewe", "alpha2": "ee", "alpha3-b": "ewe"},
                {"English": "Faroese", "alpha2": "fo", "alpha3-b": "fao"},
                {"English": "Fijian", "alpha2": "fj", "alpha3-b": "fij"},
                {"English": "Finnish", "alpha2": "fi", "alpha3-b": "fin"},
                {"English": "French", "alpha2": "fr", "alpha3-b": "fre"},
                {"English": "Western Frisian", "alpha2": "fy", "alpha3-b": "fry"},
                {"English": "Fulah", "alpha2": "ff", "alpha3-b": "ful"},
                {"English": "Georgian", "alpha2": "ka", "alpha3-b": "geo"},
                {"English": "German", "alpha2": "de", "alpha3-b": "ger"},
                {"English": "Gaelic; Scottish Gaelic", "alpha2": "gd", "alpha3-b": "gla"},
                {"English": "Irish", "alpha2": "ga", "alpha3-b": "gle"},
                {"English": "Galician", "alpha2": "gl", "alpha3-b": "glg"},
                {"English": "Manx", "alpha2": "gv", "alpha3-b": "glv"},
                {"English": "Greek, Modern (1453-)", "alpha2": "el", "alpha3-b": "gre"},
                {"English": "Guarani", "alpha2": "gn", "alpha3-b": "grn"},
                {"English": "Gujarati", "alpha2": "gu", "alpha3-b": "guj"},
                {"English": "Haitian; Haitian Creole", "alpha2": "ht", "alpha3-b": "hat"},
                {"English": "Hausa", "alpha2": "ha", "alpha3-b": "hau"},
                {"English": "Hebrew", "alpha2": "he", "alpha3-b": "heb"},
                {"English": "Herero", "alpha2": "hz", "alpha3-b": "her"},
                {"English": "Hindi", "alpha2": "hi", "alpha3-b": "hin"},
                {"English": "Hiri Motu", "alpha2": "ho", "alpha3-b": "hmo"},
                {"English": "Croatian", "alpha2": "hr", "alpha3-b": "hrv"},
                {"English": "Hungarian", "alpha2": "hu", "alpha3-b": "hun"},
                {"English": "Igbo", "alpha2": "ig", "alpha3-b": "ibo"},
                {"English": "Icelandic", "alpha2": "is", "alpha3-b": "ice"},
                {"English": "Ido", "alpha2": "io", "alpha3-b": "ido"},
                {"English": "Sichuan Yi; Nuosu", "alpha2": "ii", "alpha3-b": "iii"},
                {"English": "Inuktitut", "alpha2": "iu", "alpha3-b": "iku"},
                {"English": "Interlingue; Occidental", "alpha2": "ie", "alpha3-b": "ile"},
                {"English": "Interlingua (International Auxiliary Language Association)", "alpha2": "ia", "alpha3-b": "ina"},
                {"English": "Indonesian", "alpha2": "id", "alpha3-b": "ind"},
                {"English": "Inupiaq", "alpha2": "ik", "alpha3-b": "ipk"},
                {"English": "Italian", "alpha2": "it", "alpha3-b": "ita"},
                {"English": "Javanese", "alpha2": "jv", "alpha3-b": "jav"},
                {"English": "Japanese", "alpha2": "ja", "alpha3-b": "jpn"},
                {"English": "Kalaallisut; Greenlandic", "alpha2": "kl", "alpha3-b": "kal"},
                {"English": "Kannada", "alpha2": "kn", "alpha3-b": "kan"},
                {"English": "Kashmiri", "alpha2": "ks", "alpha3-b": "kas"},
                {"English": "Kanuri", "alpha2": "kr", "alpha3-b": "kau"},
                {"English": "Kazakh", "alpha2": "kk", "alpha3-b": "kaz"},
                {"English": "Central Khmer", "alpha2": "km", "alpha3-b": "khm"},
                {"English": "Kikuyu; Gikuyu", "alpha2": "ki", "alpha3-b": "kik"},
                {"English": "Kinyarwanda", "alpha2": "rw", "alpha3-b": "kin"},
                {"English": "Kirghiz; Kyrgyz", "alpha2": "ky", "alpha3-b": "kir"},
                {"English": "Komi", "alpha2": "kv", "alpha3-b": "kom"},
                {"English": "Kongo", "alpha2": "kg", "alpha3-b": "kon"},
                {"English": "Korean", "alpha2": "ko", "alpha3-b": "kor"},
                {"English": "Kuanyama; Kwanyama", "alpha2": "kj", "alpha3-b": "kua"},
                {"English": "Kurdish", "alpha2": "ku", "alpha3-b": "kur"},
                {"English": "Lao", "alpha2": "lo", "alpha3-b": "lao"},
                {"English": "Latin", "alpha2": "la", "alpha3-b": "lat"},
                {"English": "Latvian", "alpha2": "lv", "alpha3-b": "lav"},
                {"English": "Limburgan; Limburger; Limburgish", "alpha2": "li", "alpha3-b": "lim"},
                {"English": "Lingala", "alpha2": "ln", "alpha3-b": "lin"},
                {"English": "Lithuanian", "alpha2": "lt", "alpha3-b": "lit"},
                {"English": "Luxembourgish; Letzeburgesch", "alpha2": "lb", "alpha3-b": "ltz"},
                {"English": "Luba-Katanga", "alpha2": "lu", "alpha3-b": "lub"},
                {"English": "Ganda", "alpha2": "lg", "alpha3-b": "lug"},
                {"English": "Macedonian", "alpha2": "mk", "alpha3-b": "mac"},
                {"English": "Marshallese", "alpha2": "mh", "alpha3-b": "mah"},
                {"English": "Malayalam", "alpha2": "ml", "alpha3-b": "mal"},
                {"English": "Maori", "alpha2": "mi", "alpha3-b": "mao"},
                {"English": "Marathi", "alpha2": "mr", "alpha3-b": "mar"},
                {"English": "Malay", "alpha2": "ms", "alpha3-b": "may"},
                {"English": "Malagasy", "alpha2": "mg", "alpha3-b": "mlg"},
                {"English": "Maltese", "alpha2": "mt", "alpha3-b": "mlt"},
                {"English": "Mongolian", "alpha2": "mn", "alpha3-b": "mon"},
                {"English": "Nauru", "alpha2": "na", "alpha3-b": "nau"},
                {"English": "Navajo; Navaho", "alpha2": "nv", "alpha3-b": "nav"},
                {"English": "Ndebele, South; South Ndebele", "alpha2": "nr", "alpha3-b": "nbl"},
                {"English": "Ndebele, North; North Ndebele", "alpha2": "nd", "alpha3-b": "nde"},
                {"English": "Ndonga", "alpha2": "ng", "alpha3-b": "ndo"},
                {"English": "Nepali", "alpha2": "ne", "alpha3-b": "nep"},
                {"English": "Norwegian Nynorsk; Nynorsk, Norwegian", "alpha2": "nn", "alpha3-b": "nno"},
                {"English": "Bokm\u00e5l, Norwegian; Norwegian Bokm\u00e5l", "alpha2": "nb", "alpha3-b": "nob"},
                {"English": "Norwegian", "alpha2": "no", "alpha3-b": "nor"},
                {"English": "Chichewa; Chewa; Nyanja", "alpha2": "ny", "alpha3-b": "nya"},
                {"English": "Occitan (post 1500); Proven\u00e7al", "alpha2": "oc", "alpha3-b": "oci"},
                {"English": "Ojibwa", "alpha2": "oj", "alpha3-b": "oji"},
                {"English": "Oriya", "alpha2": "or", "alpha3-b": "ori"},
                {"English": "Oromo", "alpha2": "om", "alpha3-b": "orm"},
                {"English": "Ossetian; Ossetic", "alpha2": "os", "alpha3-b": "oss"},
                {"English": "Panjabi; Punjabi", "alpha2": "pa", "alpha3-b": "pan"},
                {"English": "Persian", "alpha2": "fa", "alpha3-b": "per"},
                {"English": "Pali", "alpha2": "pi", "alpha3-b": "pli"},
                {"English": "Polish", "alpha2": "pl", "alpha3-b": "pol"},
                {"English": "Portuguese", "alpha2": "pt", "alpha3-b": "por"},
                {"English": "Pushto; Pashto", "alpha2": "ps", "alpha3-b": "pus"},
                {"English": "Quechua", "alpha2": "qu", "alpha3-b": "que"},
                {"English": "Romansh", "alpha2": "rm", "alpha3-b": "roh"},
                {"English": "Romanian; Moldavian; Moldovan", "alpha2": "ro", "alpha3-b": "rum"},
                {"English": "Rundi", "alpha2": "rn", "alpha3-b": "run"},
                {"English": "Russian", "alpha2": "ru", "alpha3-b": "rus"},
                {"English": "Sango", "alpha2": "sg", "alpha3-b": "sag"},
                {"English": "Sanskrit", "alpha2": "sa", "alpha3-b": "san"},
                {"English": "Sinhala; Sinhalese", "alpha2": "si", "alpha3-b": "sin"},
                {"English": "Slovak", "alpha2": "sk", "alpha3-b": "slo"},
                {"English": "Slovenian", "alpha2": "sl", "alpha3-b": "slv"},
                {"English": "Northern Sami", "alpha2": "se", "alpha3-b": "sme"},
                {"English": "Samoan", "alpha2": "sm", "alpha3-b": "smo"},
                {"English": "Shona", "alpha2": "sn", "alpha3-b": "sna"},
                {"English": "Sindhi", "alpha2": "sd", "alpha3-b": "snd"},
                {"English": "Somali", "alpha2": "so", "alpha3-b": "som"},
                {"English": "Sotho, Southern", "alpha2": "st", "alpha3-b": "sot"},
                {"English": "Spanish; Castilian", "alpha2": "es", "alpha3-b": "spa"},
                {"English": "Sardinian", "alpha2": "sc", "alpha3-b": "srd"},
                {"English": "Serbian", "alpha2": "sr", "alpha3-b": "srp"},
                {"English": "Swati", "alpha2": "ss", "alpha3-b": "ssw"},
                {"English": "Sundanese", "alpha2": "su", "alpha3-b": "sun"},
                {"English": "Swahili", "alpha2": "sw", "alpha3-b": "swa"},
                {"English": "Swedish", "alpha2": "sv", "alpha3-b": "swe"},
                {"English": "Tahitian", "alpha2": "ty", "alpha3-b": "tah"},
                {"English": "Tamil", "alpha2": "ta", "alpha3-b": "tam"},
                {"English": "Tatar", "alpha2": "tt", "alpha3-b": "tat"},
                {"English": "Telugu", "alpha2": "te", "alpha3-b": "tel"},
                {"English": "Tajik", "alpha2": "tg", "alpha3-b": "tgk"},
                {"English": "Tagalog", "alpha2": "tl", "alpha3-b": "tgl"},
                {"English": "Thai", "alpha2": "th", "alpha3-b": "tha"},
                {"English": "Tibetan", "alpha2": "bo", "alpha3-b": "tib"},
                {"English": "Tigrinya", "alpha2": "ti", "alpha3-b": "tir"},
                {"English": "Tonga (Tonga Islands)", "alpha2": "to", "alpha3-b": "ton"},
                {"English": "Tswana", "alpha2": "tn", "alpha3-b": "tsn"},
                {"English": "Tsonga", "alpha2": "ts", "alpha3-b": "tso"},
                {"English": "Turkmen", "alpha2": "tk", "alpha3-b": "tuk"},
                {"English": "Turkish", "alpha2": "tr", "alpha3-b": "tur"},
                {"English": "Twi", "alpha2": "tw", "alpha3-b": "twi"},
                {"English": "Uighur; Uyghur", "alpha2": "ug", "alpha3-b": "uig"},
                {"English": "Ukrainian", "alpha2": "uk", "alpha3-b": "ukr"},
                {"English": "Urdu", "alpha2": "ur", "alpha3-b": "urd"},
                {"English": "Uzbek", "alpha2": "uz", "alpha3-b": "uzb"},
                {"English": "Venda", "alpha2": "ve", "alpha3-b": "ven"},
                {"English": "Vietnamese", "alpha2": "vi", "alpha3-b": "vie"},
                {"English": "Volap\u00fck", "alpha2": "vo", "alpha3-b": "vol"},
                {"English": "Welsh", "alpha2": "cy", "alpha3-b": "wel"},
                {"English": "Walloon", "alpha2": "wa", "alpha3-b": "wln"},
                {"English": "Wolof", "alpha2": "wo", "alpha3-b": "wol"},
                {"English": "Xhosa", "alpha2": "xh", "alpha3-b": "xho"},
                {"English": "Yiddish", "alpha2": "yi", "alpha3-b": "yid"},
                {"English": "Yoruba", "alpha2": "yo", "alpha3-b": "yor"},
                {"English": "Zhuang; Chuang", "alpha2": "za", "alpha3-b": "zha"},
                {"English": "Zulu", "alpha2": "zu", "alpha3-b": "zul"}
            ],
            map = new Map(),
            reversemap = new Map();




    /**
     * Get Langage infos using langcode
     * @param {string} langcode
     * @returns {Object}
     */
    function getLangInfos(langcode){
        let result = {
            lang: "Undetermined",
            codes: ["und", "und"]
        };
        if (typeof langcode === s && langcode.length > 0) {
            if (langcode.length > 1 && langcode.length < 4) result = getLangInfos.map.get(langcode.toLowerCase()) || result;
            else result = getLangInfos.reverse.get(langcode.toLowerCase()) || result;
        }
        return result;
    }

    getLangInfos.data = data.map((entry, index) => {
        let newentry = {
            lang: entry.English,
            langword: entry.English.replace(/^([\w\-]+).*$/, '$1'),
            codes: [entry.alpha2, entry["alpha3-b"]]
        };
        map.set(entry.alpha2, newentry);
        map.set(entry["alpha3-b"], newentry);
        reversemap.set(entry.English.toLowerCase(), newentry);
        return newentry;
    }).sort((a, b) => a.langword.localeCompare(b.langword));

    getLangInfos.map = map;
    getLangInfos.reverse = reversemap;

    return getLangInfos;
}));

