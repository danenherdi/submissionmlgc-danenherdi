const tfjs = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
	try{
		const tensor = tfjs.node
			.decodeImage(image)
			.resizeNearestNeighbor([224, 224])
			.expandDims()
			.toFloat();

		const prediction = model.predict(tensor);
		const score = await prediction.data();
		const confidenceScore = Math.max(...score) * 100;

		// const classes = ['Cancer', 'Non-cancer'];
		// const classResult = tfjs.argMax(prediction, 1).dataSync()[0];
		// const label = classes[classResult];

		const label = score[0] > 0.5 ? 'Cancer' : 'Non-cancer';

		let suggestion;

		if (label === 'Cancer') {
			suggestion = 'Segera periksa ke dokter!';
		} else {
			suggestion = 'Tidak ada tanda-tanda kanker kulit';
		}

		return {
			label,
			suggestion,
			confidenceScore
		};
	} catch (error) {
		throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
	}
}

module.exports = predictClassification;