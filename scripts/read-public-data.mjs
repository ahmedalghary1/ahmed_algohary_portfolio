// QA consumes the same publication/order rules as the Python build.
import { execFileSync } from 'node:child_process';
export function readPublicData() {
  return JSON.parse(execFileSync('python', ['-X','utf8','-c',
    "import json,sys;sys.path.insert(0,'scripts');from project_data import prepare_public_data;print(json.dumps(prepare_public_data(json.load(open('data/portfolio.json',encoding='utf-8')))))"
  ], { encoding:'utf8' }));
}
