import { useState } from 'react';
import { toast } from 'react-toastify';

type EditModalProps = {
	_id: string;
};

// get all needed values from props
const EditModal = ({ _id }: EditModalProps) => {
	// create a form state for updating the form, set the initial value from the current value of each property
	// hint: check the CreatePost form
	//
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [loading, setLoading] = useState(false);
	console.log(isConfirmed);

	// implement handleChange once form state is in place
	// const handleChange = (
	// 	e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	// ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			// simple validation that all fields are filled out
			//
			setLoading(true);

			// call function that makes a fetch request to update the post in the DB, store updated post in a variable
			//

			// using the posts state setter, update the state so your UI changes with changes made to post
			//
		} catch (error) {
			const message = (error as { message: string }).message;
			toast.error(message);
		} finally {
			setIsConfirmed(false);
			setLoading(false);
			document.querySelector<HTMLDialogElement>(`#edit-modal-${_id}`)!.close();
		}
	};
	return (
		<dialog id={`edit-modal-${_id}`} className='modal'>
			<div className='modal-box'>
				<form method='dialog'>
					{/* if there is a button in form, it will close the modal */}
					<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
						✕
					</button>
				</form>
				<h3 className='font-bold text-lg'>Edit your post</h3>
				<form
					onSubmit={handleSubmit}
					className='md:w-1/2 mx-auto flex flex-col gap-3'
				>
					<div className='flex gap-2 justify-between'>
						<label className='form-control grow'>
							<div className='label-text'>Title</div>
							<input
								name='newTitle'
								// value={newTitle}
								// onChange={handleChange}
								placeholder='A title for your post...'
								className='input input-bordered w-full'
							/>
						</label>
					</div>
					<label className='form-control w-full'>
						<div className='label-text'>Image URL</div>
						<input
							name='newImage'
							// value={newImage}
							// onChange={handleChange}
							placeholder='The URL of an image for your post...'
							className='input input-bordered w-full'
						/>
					</label>
					<label className='form-control'>
						<div className='label-text'>Content</div>
						<textarea
							name='newContent'
							// value={newContent}
							// onChange={handleChange}
							className='textarea textarea-bordered h-24'
							placeholder='The content of your post...'
						></textarea>
					</label>
					{/* conditionally render buttons based on setIsConfirmed state */}
					<button
						// onClick set isConfirmed to true
						//
						className='btn btn-primary self-center'
					>
						Edit Post
					</button>

					<p>Are you sure?</p>

					<button type='submit' disabled={loading} className='btn btn-success'>
						Confirm
					</button>
				</form>
			</div>
		</dialog>
	);
};

export default EditModal;
