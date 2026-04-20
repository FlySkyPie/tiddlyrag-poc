import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Tiddler } from './tiddler.entity';
import { Wiki } from '../wikis/wiki.entity';

@Injectable()
export class TiddlersService {
  constructor(
    @Inject('TIDDLER_REPOSITORY')
    private tiddlerRepository: Repository<Tiddler>,
    @Inject('WIKI_REPOSITORY')
    private wikiRepository: Repository<Wiki>,
  ) {}

  async create(tiddlers: Partial<Tiddler>[]): Promise<Tiddler[]> {
    return this.tiddlerRepository.save(tiddlers);
  }

  async findAll(wikiId: string): Promise<Tiddler[]> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });
    if (!wiki) {
      throw new NotFoundException(`Wiki not found: ${wikiId}`);
    }
    return this.tiddlerRepository.find({
      where: { wiki: { id: wikiId } },
    });
  }

  async findOne(wikiId: string, title: string): Promise<Tiddler> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });
    if (!wiki) {
      throw new NotFoundException(`Wiki not found: ${wikiId}`);
    }
    const tiddler = await this.tiddlerRepository.findOne({
      where: { wiki: { id: wikiId }, title },
    });
    if (!tiddler) {
      throw new NotFoundException(`Tiddler not found: ${title}`);
    }
    return tiddler;
  }

  async update(
    wikiId: string,
    title: string,
    updateData: Partial<Tiddler>,
  ): Promise<Tiddler> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });
    if (!wiki) {
      throw new NotFoundException(`Wiki not found: ${wikiId}`);
    }
    const tiddler = await this.tiddlerRepository.findOne({
      where: { wiki: { id: wikiId }, title },
    });
    if (!tiddler) {
      throw new NotFoundException(`Tiddler not found: ${title}`);
    }
    Object.assign(tiddler, updateData);
    return this.tiddlerRepository.save(tiddler);
  }

  async delete(wikiId: string, title: string): Promise<void> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });
    if (!wiki) {
      throw new NotFoundException(`Wiki not found: ${wikiId}`);
    }
    const tiddler = await this.tiddlerRepository.findOne({
      where: { wiki: { id: wikiId }, title },
    });
    if (!tiddler) {
      throw new NotFoundException(`Tiddler not found: ${title}`);
    }
    await this.tiddlerRepository.remove(tiddler);
  }
}
