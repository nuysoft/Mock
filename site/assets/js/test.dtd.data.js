define(['jquery', 'underscore', 'mock'], function($, _, Mock) {
	return {
		'String': {
			'\'name|min-max\': string': [{
				'string|1-10': '★'
			}],
			'\'name|count\': string': [{
				'string|3': '★★★'
			}]
		},
		'Number': {
			'\'name|+1\': number': [{
				'number|+1': 100
			}],
			'\'name|min-max\': number': [{
				'number|1-100': 100
			}],
			'\'name|min-max.dmin-dmax\': number': [{
				'number|1-100.1-10': 1
			}, {
				'number|123.1-10': 1
			}, {
				'number|123.3': 1
			}, {
				'number|123.10': 1.123
			}]
		},
		'Boolean': {
			'\'name|1\': boolean': [{
				'boolean|1': true
			}],
			'\'name|min-max\': boolean': [{
				'boolean|1-2': true
			}]
		},
		'Object': {
			'\'name|count\': object': [{
				'object|2': {
					'310000': '上海市',
					'320000': '江苏省',
					'330000': '浙江省',
					'340000': '安徽省'
				}
			}],
			'\'name|min-max\': object': [{
				'object|2-4': {
					'110000': '北京市',
					'120000': '天津市',
					'130000': '河北省',
					'140000': '山西省'
				}
			}]
		},
		'Array': {
			'\'name|1\': array': [{
				'array|1': ['AMD', 'CMD', 'UMD']
			}],
			'\'name|+1\': array': [{
				'array|+1': ['AMD', 'CMD', 'UMD']
			}, {
				'array|1-10': [{
					'name|+1': ['Hello', 'Mock.js', '!']
				}]
			}],
			'\'name|min-max\': array': [{
				'array|1-10': ['Mock.js']
			}, {
				'array|1-10': ['Hello', 'Mock.js', '!']
			}],
			'\'name|count\': array': [{
				'array|3': ['Mock.js']
			}, {
				'array|3': ['Hello', 'Mock.js', '!']
			}],
		},
		'Function': {
			'\'name\': function': [
				Mock.heredoc(function() {
					/*
{
  'foo': 'Syntax Demo',
  'name': function() {
    return this.foo
  }
}
                     */
				})
			]
		},
		'RegExp': {
			'\'name\': regexp': [
				Mock.heredoc(function() {
					/*
{
  'regexp': /[a-z][A-Z][0-9]/
}
                     */
				}),
				Mock.heredoc(function() {
					/*
{
  'regexp': /\w\W\s\S\d\D/
}
                     */
				}),
				Mock.heredoc(function() {
					/*
{
  'regexp': /\d{5,10}/
}
                     */
				})
			]
		},
		'Path': {
			'Absolute Path': [{
				'foo': 'Hello',
				'nested': {
					a: {
						b: {
							c: 'Mock.js'
						}
					}
				},
				'absolutePath': '@/foo @/nested/a/b/c'
			}],
			'Relative Path': [{
				'foo': 'Hello',
				'nested': {
					a: {
						b: {
							c: 'Mock.js'
						}
					}
				},
				'relativePath': {
					a: {
						b: {
							c: '@../../../foo @../../../nested/a/b/c'
						}
					}
				}
			}]
		}
	}
})