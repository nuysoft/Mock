/*
	    随机生成一个 GUID。

	    http://www.broofa.com/2008/09/javascript-uuid-function/
	    [UUID 规范](http://www.ietf.org/rfc/rfc4122.txt)
	        UUIDs (Universally Unique IDentifier)
	        GUIDs (Globally Unique IDentifier)
	        The formal definition of the UUID string representation is provided by the following ABNF [7]:
	            UUID                   = time-low "-" time-mid "-"
	                                   time-high-and-version "-"
	                                   clock-seq-and-reserved
	                                   clock-seq-low "-" node
	            time-low               = 4hexOctet
	            time-mid               = 2hexOctet
	            time-high-and-version  = 2hexOctet
	            clock-seq-and-reserved = hexOctet
	            clock-seq-low          = hexOctet
	            node                   = 6hexOctet
	            hexOctet               = hexDigit hexDigit
	            hexDigit =
	                "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
	                "a" / "b" / "c" / "d" / "e" / "f" /
	                "A" / "B" / "C" / "D" / "E" / "F"
	    
	    https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349

		KonghaYao : GUID 为微软对 GUID 的一种实现，在此实现的 guid 是对 uuid 的字符串转换
	
		UUID格式：xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxxxxxx(8-4-4-16)
		GUID格式：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12)
	*/
import { v4 as uuid } from "uuid";
export default function guid() {
    return uuid().replace(/(?<=[^-]{4}-[^-]{4}-[^-]{4}-[^-]{4})/, "-");
}
