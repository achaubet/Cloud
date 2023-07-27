import { marked } from 'marked'
import * as mongoose from 'mongoose';
import slugify from 'slugify';
import createDomPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const dompurify = createDomPurify(new JSDOM().window);


const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  },
  deletable: {
    type: Boolean,
    required: false
  },
  editable: {
    type: Boolean,
    required: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})

const Article = mongoose.model('Article', articleSchema);

export const find = async () => {
  return await Article.find().populate("author").sort({ createdAt: 'desc' });
}

export default Article;
