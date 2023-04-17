import { ReadAndSummarizeOptions, ReadAndSummarizePayload } from './types';
import {
  ChatGPTService,
  Prompt,
  SpiderService,
} from '../';
import { Category, Summary } from '../../api/v1/schema/models';
import { BaseService } from '../base';

const MAX_OPENAI_TOKEN_COUNT = 4096 as const;
const BAD_RESPONSE_EXPR = /^["']?[\s\n]*(?:Understood,|Alright,|okay, i|Okay. How|I am an AI|I'm sorry|stay (?:informed|updated)|keep yourself updated|CNBC: stay|CNBC is offering|sign\s?up|HuffPost|got it. |how can i|hello!|okay, i'm|sure,)/i;

export class ScribeService extends BaseService {
  
  static categories: string[] = [];
  
  public static async init() {
    await Category.initCategories();
    const categories = await Category.findAll();
    this.categories = categories.map((c) => c.displayName);
  }
  
  public static async readAndSummarize(
    { url, content }: ReadAndSummarizePayload,
    {
      onProgress, force, outletId, 
    }: ReadAndSummarizeOptions = {}
  ): Promise<Summary> {
    if (this.categories.length === 0) {
      await this.init();
    }
    if (!outletId) {
      throw new Error('no outlet id specified');
    }
    if (!force) {
      const existingSummary = await Summary.findOne({ where: { url } });
      if (existingSummary) {
        console.log(`Summary already exists for ${url}`);
        return existingSummary;
      }
    } else {
      console.log(`Forcing summary rewrite for ${url}`);
    }
    let subjectContent = content;
    let originalTitle = '';
    let rawText = content;
    if (!subjectContent) {
      // fetch web content with the spider
      const spider = new SpiderService();
      const loot = await spider.loot(url);
      // create the prompt onReply map to be sent to chatgpt
      if (loot.filteredText.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
        throw new Error('Article too long for OpenAI');
      }
      subjectContent = loot.filteredText;
      originalTitle = loot.title;
      rawText = loot.text;
    }
    const newSummary = Summary.json<Summary>({
      filteredText: subjectContent,
      originalTitle,
      outletId,
      rawText,
      url,
    });
    const prompts: Prompt[] = [
      {
        onReply: (reply) => { 
          if (reply.text.length > 200) {
            throw new Error(['Title too long'].join('\n'));
          }
          newSummary.title = reply.text;
        },
        text: [
          'Please summarize the general take away message of the following article in a single sentence using no more than 150 characters:\n\n', 
          newSummary.filteredText,
        ].join(''),
      },
      {
        onReply: (reply) => {
          newSummary.bullets = reply.text
            .replace(/^bullets:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((bullet) => bullet.trim());
        },
        text: 'Please provide 5 concise bullet point sentences no longer than 10 words each that summarize this article using • as the bullet symbol',
      },
      {
        onReply: (reply) => { 
          newSummary.shortSummary = reply.text;
        },
        text: 'Please provide a two sentence summary using no more than 300 characters',
      },
      {
        onReply: (reply) => { 
          newSummary.summary = reply.text;
        },
        text: 'Please provide a 100 to 200 word summary',
      },
      {
        onReply: (reply) => { 
          newSummary.longSummary = reply.text;
        },
        text: 'Please provide a 200 to 300 word summary',
      },
      {
        onReply: (reply) => { 
          newSummary.text = reply.text;
        },
        text: 'Please provide a 300 to 400 word summary',
      },
      {
        onReply: (reply) => {
          newSummary.tags = reply.text
            .replace(/^tags:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((tag) => tag.trim());
        },
        text: 'Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10',
      },
      {
        onReply: (reply) => { 
          newSummary.category = reply.text
            .replace(/^category:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please select a best category for this article from the following choices: ${this.categories.join(' ')}`,
      },
      {
        onReply: (reply) => { 
          newSummary.subcategory = reply.text
            .replace(/^subcategory:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please provide a one word subcategory for this article under the category '${newSummary.category}'`,
      },
      {
        onReply: (reply) => {
          newSummary.imagePrompt = reply.text;
        },
        text: 'Please provide a short image prompt for an ai image generator to make an image for this article',
      },
    ];
    // initialize chatgpt service and send the prompt
    const chatgpt = new ChatGPTService();
    // iterate through each summary prompt and send them to chatgpt
    for (let n = 0; n < prompts.length; n++) {
      const prompt = prompts[n];
      const reply = await chatgpt.send(prompt.text);
      if (BAD_RESPONSE_EXPR.test(reply.text)) {
        throw new Error(['Bad response from chatgpt', '--prompt--', prompt.text, '--repl--', reply.text].join('\n'));
      }
      console.log(reply);
      prompt.onReply(reply);
      if (onProgress) {
        onProgress((n + 1) / prompts.length);
      }
    }
    const category = await Category.findOne({ where: { displayName: newSummary.category } });
    newSummary.category = category.name;
    console.log('Created new summary from', url, newSummary.title);
    const summary = await Summary.create(newSummary);
    return summary;
  }
  
}