module.exports = {
	entry: {
		animation: './src/animation.js'//入口地址
	},
	output: {
		path: __dirname + '/build',//生成文件的目录，__dirname当前根目录
		filename: '[name].js',//[name] 就是 entry 的 key
		library: 'animation',//在window上注册一个animation对象
		libraryTarget: 'umd'//支持CMD也支持AMD
	}
};